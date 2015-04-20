$(document).ready(function() {

	listNotifications();

    $('.list-group-item').on('mouseover', function(event) {
		event.preventDefault();
        if(!$(this).closest('li').hasClass('prevent'))
		  $(this).closest('li').addClass('open');
	});
    
    $('.list-group-item').on('mouseout', function(event) {
    	event.preventDefault();
        if(!$(this).closest('li').hasClass('prevent'))
		  $(this).closest('li').removeClass('open');
	});

    $('.list-group-item').on('click', '.list-group-submenu-item', function() {
    	deleteNotification($(this));
    });

});

function listNotifications()
{
	$.ajax({
        type : "POST",
        url : "http://enkwebservice.com/cloud/notifications",
        data : "data=" + JSON.stringify({data : {
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        crossDomain : true,
        async: false
    })
    .success(function(data) {
        $('.list-group').empty();

        if(data.notifications.length > 0)
        {
            $.each(data.notifications, function(index, item) {
                $('.list-group')
                	.append($('<li>')
            			.attr('class', 'list-group-item')
            			.text(item.content)
            			.append($('<ul>')
            				.attr('class', 'list-group-submenu')
            				.append($('<li>')
            					.attr('class', 'list-group-submenu-item primary')
            					.attr('data-id', btoa(item.id))
            					.append($('<span>')
            						.attr('class', 'glyphicon glyphicon-remove')
            					)
            				)
            			)
                	);
            });
        }
        else
        {
            $('.list-group')
                .append($('<li>')
                    .attr('class', 'list-group-item prevent')
                    .append($('<em>')
                        .text("Vous n'avez aucune notification")
                    )
                );
        }
    });
}

function deleteNotification(notif)
{
	$.ajax({
        type : "POST",
        url : "http://enkwebservice.com/cloud/notifications/delete",
        data : "data=" + JSON.stringify({data : {
        	Notification : {id : notif.attr('data-id')},
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        crossDomain : true,
        async: false
    })
    .success(function(){
    	listNotifications();
    });
}
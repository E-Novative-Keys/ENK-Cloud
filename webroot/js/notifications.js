$(document).ready(function() {

	listNotifications();



    /*** Gestion des notifications ***/

    // Affichage du bouton de suppression de notification au passage de la souris sur une notification
    $('.list-group').on('mouseover', '.list-group-item', function(event) {
		event.preventDefault();
        if(!$(this).closest('li').hasClass('prevent'))
		  $(this).closest('li').addClass('open');
	});
    
    // Lorsque la souris n'est plus sur la notification, on cache le bouton de suppression de notification
    $('.list-group').on('mouseout', '.list-group-item', function(event) {
    	event.preventDefault();
        if(!$(this).closest('li').hasClass('prevent'))
		  $(this).closest('li').removeClass('open');
	});

    // Evènement au click sur le bouton de suppression d'une notification
    $('.list-group').on('click', '.list-group-submenu-item', function() {
    	deleteNotification($(this));
    });

});

/**
* Liste les notifications pour l'utilisateur courant tout projet confondu
*/
function listNotifications()
{
	$.ajax({
        type : "POST",
        url : "http://enkwebservice.com/cloud/notifications",
        data : "data=" + JSON.stringify({data : {
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        crossDomain : true
    })
    .success(function(data) {
        $('.list-group').empty();

        if(data.notifications.length > 0)
        {
            $.each(data.notifications, function(index, item) {
                $('.list-group')
                	.append($('<li>')
            			.attr('class', 'list-group-item')
            			.text(item.created + ' - ' + item.content)
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

/**
* Suppression d'une notification et mise à jour de la liste de notifications
* @param notif  (objet/notif ayant l'id de la notif à supprimer -> data-id)
*/
function deleteNotification(notif)
{
	$.ajax({
        type : "POST",
        url : "http://enkwebservice.com/cloud/notifications/delete",
        data : "data=" + JSON.stringify({data : {
        	Notification : {id : notif.attr('data-id')},
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        crossDomain : true
    })
    .success(function(){
    	listNotifications();
    });
}

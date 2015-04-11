$(document).ready(function() {

	listProjects();
	listMails();

	// Sélecteur mail
	$('#mails').selectable({
        filter:'.mail'
    });

    // Sélection d'un projet
    $('.projects-button').on('click', '.project', function() {
        $('.projects-button').attr("data-project", $(this).attr("data-id"));
        listMails();
    });

    $('table').on("click", ".mail", function() {
        mailDetails($(this));
    });

    // Menu contextuel au click droit
    $.contextMenu({
        selector: '#mails .mail', 
        callback: function(key, options) {
            if(key == "delete")
                deleteMail($(this));
        },
        items: {
            "delete": {name: "Supprimer", icon: "delete"},
        }
    });
});

function listProjects() {
    $.ajax({
        type : "POST",
        url : "http://enkwebservice.com/projects",
        data : "data=" + JSON.stringify({data : {
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        crossDomain : true,
        async: false
    })
    .success(function(data) {
        $.each(data.projects, function(index, item) {
            var li = $('<li>')
                .attr("class", "project")
                .attr("data-id", btoa(index))
                .append($('<a>')
                    .html(item)
                );

            $('.projects-button ul').append(li);
        });

        $('.projects-button').attr("data-project", $('.projects-button ul .project:first-child').attr("data-id"));
    });
}
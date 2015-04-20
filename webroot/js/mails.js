$(document).ready(function() {
    
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
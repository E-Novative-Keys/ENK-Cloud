$(document).ready(function() {

	listMails();



    /*** Gestion des messages ***/

    /* Liste de messages */

    // Librairie jQuery permettant la selection de tr
	$('#mails').selectable({
        filter:'.mail'
    });
    
    /* Détails d'un message */

    // Evènement au click sur un message, affichage de ses détails dans la zone réservée
    $('table').on("click", ".mail", function() {
        mailDetails($(this));
    });



    /*** Menu Contextuel ***/

    // Menu présent au click droit sur un message reçu/envoyé
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
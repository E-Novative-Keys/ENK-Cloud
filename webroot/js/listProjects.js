/*
* Sélection de projets pour l'envoi de message
* L'utilisateur sélectionne quel est le projet concerné par le message qu'il écrit
*/
$(document).ready(function() {
    listProjects();



    /*** Sélecteur de projets ***/

    // Mise à jour d'informations et champs caché au click sur un projet
    $('.projects-button').on('click', '.project', function() {
        $('.projects-button .inline').text($(this).text());
        $('.projects-button').attr("data-project", $(this).attr("data-id"));
        $('#project-name').html($(this).html().replace(new RegExp("<[^>]*>"), ""));
        $('#project').attr('value', $(this).attr('data-id'));
    });
});

/**
* Affiche la liste des projets de l'utilisateur courant dans un sélecteur de projets
* !! async : false
*/
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

            if($('#project-name').text().length == 0)
            {
                $('#project-name').html(item);
                $('#project').attr('value', btoa(index));
            }
        });

        $('.projects-button .inline').text($('.projects-button ul .project:first-child').text());
        $('.projects-button').attr("data-project", $('.projects-button ul .project:first-child').attr("data-id"));
    });
}
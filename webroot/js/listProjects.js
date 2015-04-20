$(document).ready(function() {
    listProjects();

    // Sélection d'un projet
    $('.projects-button').on('click', '.project', function() {
        $('.projects-button').attr("data-project", $(this).attr("data-id"));
        $('#project-name').html($(this).html().replace(new RegExp("<[^>]*>"), ""));
        $('#project').attr('value', $(this).attr('data-id'));
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
            $('#project-name').html(item);
            $('#project').attr('value', btoa(index));
        });

        $('.projects-button').attr("data-project", $('.projects-button ul .project:first-child').attr("data-id"));
    });
}
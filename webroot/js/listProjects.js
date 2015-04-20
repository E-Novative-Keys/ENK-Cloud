$(document).ready(function() {
    listProjects();
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
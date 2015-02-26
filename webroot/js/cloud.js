$(document).ready(function() {
    listFiles("client", btoa("/"));
    listFiles("dev", btoa("/"));

    $('table').on("click", ".file", function() {
        if($(this).attr("data-dir") == "true")
            listFiles("client", $(this).attr("data-file"));
        else
            download($(this).attr("data-file"));
    });
});

function listFiles(user, dir) {
    $.ajax({
        type : "POST",
        url : "http://enkwebservice.com/cloud/files/" + user,
        data : 'data=' + JSON.stringify({data : {
            Cloud : {project : 1, directory : dir},
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        crossDomain: true,
        dataType : "json"
    })
    .success(function(data) {
        $('#' + user + '-files').find('tbody').empty();

        $.each(data.content, function(index, item) {
            $('#' + user + '-files').find('tbody')
                .append($('<tr>')
                    .attr("data-file", btoa(((atob(dir) == "/") ? atob(dir) : atob(dir) + "/") + item.filename))
                    .attr("data-dir", item.isDir)
                    .attr("class", "file")
                    .append($('<td>')
                        .text((item.filename.length > 100) ? item.filename.substring(0, 100) + "..." : item.filename)
                    )
                    .append($('<td>')
                        .text(item.size).filesize()
                    )
                    .append($('<td>')
                        .text(item.extension)
                    )
                    .append($('<td>')
                        .text(function(){
                            var time = new Date(item.mtime * 1000);
                            return time.getDate() + "/" + time.getMonth()+1 + "/" + time.getFullYear();
                        })
                    )
                );
        });
    })
    .fail(function() {
        alert("fail");
    });
}

function download(file) {
    $.ajax({
        type : "POST",
        url : "http://enkwebservice.com/cloud/files/download",
        data : "data=" + JSON.stringify({data : {
            Cloud : {project : 1, path : file},
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        crossDomain : true
    })
    .success(function(data){
        console.log(data);
    });
}
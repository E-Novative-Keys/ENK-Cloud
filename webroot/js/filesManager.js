function listFiles(user, dir, search)
{
    var ret = atob(dir).split('/');
    ret.pop();
    ret = (ret.join('/') == "") ? '/' : ret.join('/');

    if(search)
        var cloud = {project : $('.projects-button').attr("data-project"), directory : dir, search : search};
    else
        var cloud = {project : $('.projects-button').attr("data-project"), directory : dir};

    if(user == 'client')
    {
        $('#storage').attr("data-dir", dir);

        if(atob(dir) != '/')
            $('#storage span').text(atob(dir));
        else
            $('#storage span').text("Espace de stockage");
    }

    $('#previous_' + user)
        .attr("onclick", "listFiles('" + user + "', '" + btoa(ret) + "');");    

    $.ajax({
        type : "POST",
        url : "http://enkwebservice.com/cloud/files/" + user,
        data : 'data=' + JSON.stringify({data : {
            Cloud : cloud,
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        crossDomain: true,
        dataType : "json"
    })
    .success(function(data) {
        $('#' + user + '-files').find('tbody').empty();

        $.each(data.content, function(index, item) {
            var img = item.isDir ? 'directory' : item.extension;

            $('#' + user + '-files').find('tbody')
                .append($('<tr>')
                    .attr("data-file", btoa(((atob(dir) == "/") ? atob(dir) : atob(dir) + "/") + item.filename))
                    .attr("data-dir", item.isDir)
                    .attr("data-user", user)
                    .attr("data-comment", item.comment)
                    .attr("class", "file")
                    .append($('<td>')
                        .html('<img src="img/icons/' + img + '.png" class="adaptated-src" /> <span>' + ((item.filename.length > 100) ? item.filename.substring(0, 100) + "..." : item.filename) + '</span>')
                    )
                    .append($('<td>')
                        .append($('<span>')
                            .text(item.size).filesize()
                            .attr("style", "visibility:" + (item.isDir == true ? "hidden" : "visible"))
                        ) 
                    )
                    .append($('<td>')
                        .text(item.extension)
                    )
                    .append($('<td>')
                        .text(item.mtime)
                    )
                );
        });
        
        if(user == 'client')
            $('#client-dropzone')
                .attr("style", "height: calc(100% - " + $('#' + user + '-files').height() + "px - 1px);")
                .attr("data-dir", "true")
                .attr("data-file", $('#storage').attr("data-dir"));
    })
    .fail(function(data) {
        $('#' + user + '-files').find('tbody').empty();
        $('#' + user + '-files').find('tbody')
            .append($('<tr>')
                .append($('<td>')
                    .attr("colspan", 4)
                    .attr("class", "center")
                    .text("Une erreur est survenue lors de la récupération de la liste de fichiers")
                )
            )
    });
}

function folderCreate() 
{
    var name = prompt("Nouveau dossier", "");

    var dir = $('#storage').attr("data-dir");

    $.ajax({
        type : "POST",
        url : "http://enkwebservice.com/cloud/folder/add",
        data : "data=" + JSON.stringify({data : { 
            Cloud : {project : $('.projects-button').attr("data-project"), directory : dir, name : name},
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        crossDomain : true
    })
    .done(function() {
        listFiles("client", dir);
    });
}

function renameFile(tr)
{
    var rename = prompt("New file name", "");

    var dir = atob(tr.attr("data-file"));
    var args = dir.split('/');
    var name = '';

    if(tr.attr("data-dir") == "false")
    {
        name = args[args.length-1];
        dir = dir.replace(args[args.length-1], '');
    }

    if(rename)
    {
        $.ajax({
            type : "POST",
            url : "http://enkwebservice.com/cloud/files/rename",
            data : "data=" + JSON.stringify({data : {
                Cloud : {project : $('.projects-button').attr("data-project"), directory : btoa(dir), name : name, rename : rename},
                Token : {link : $('#link').val(), fields : $('#fields').val()}
            }}),
            dataType : "json",
            crossDomain : true
        })
        .success(function(data) {
            args[args.length-1] = rename;
            tr.find('td:first-child span').text(rename);
            tr.attr("data-file", btoa(args.join('/')));

            var ext = ((args = rename.split('.')) != undefined && args.length > 1) ? args.pop() : '';

            if(tr.attr("data-dir") == "true")
                tr.find('td:first-child img').attr("src", "img/icons/directory.png");
            else if(ext.length > 0)
                tr.find('td:first-child img').attr("src", "img/icons/" + ext + ".png");

            tr.find('td:nth-child(3)').html(ext);
        })
        .fail(function(e){
            alert(e);
        });
    }
}

function moveFile(tr)
{
    var files = $('.ui-selected');

    files.each(function(index) {
        var dir = atob(files.eq(index).attr("data-file"));
        var args = dir.split('/');
        var name = '';

        if(files.eq(index).attr("data-dir") == "false")
        {
            name = args[args.length-1];
            dir  = dir.replace(args[args.length-1], '');
        }
        
        $.ajax({
           type : "POST",
            url : "http://enkwebservice.com/cloud/files/rename",
            data : "data=" + JSON.stringify({data : {
                Cloud : {project : $('.projects-button').attr("data-project"), directory : btoa(dir), name : name, rename : atob(tr.attr("data-file")) + "/" + name},
                Token : {link : $('#link').val(), fields : $('#fields').val()}
            }}),
            dataType : "json",
            crossDomain : true
        })
        .success(function() {
            listFiles("client", btoa(dir));
        });
    });
}

function deleteFile(tr)
{
    if(confirm("Voulez-vous supprimer cet élément ?"))
    {
        var dir = atob(tr.attr("data-file")); 
        var args = dir.split('/');
        var name = '';

        if(tr.attr("data-dir") == "false")
        {
            name = args[args.length-1]; 
            dir = dir.replace(args[args.length-1], ''); 
        }

        $.ajax({
            type : "POST",
            url : "http://enkwebservice.com/cloud/files/delete",
            data : "data=" + JSON.stringify({data : { 
                Cloud : {project : $('.projects-button').attr("data-project"), directory : btoa(dir), name : name},
                Token : {link : $('#link').val(), fields : $('#fields').val()}
            }}),
            crossDomain : true
        })
        .success(function() {
            args.pop();
            dir = btoa(args.join('/'));
            listFiles(tr.attr("data-user"), (dir.length == 0) ? btoa('/') : dir);
        });
    }
}

function download(user, file)
{
    $url = "http://enkwebservice.com/cloud/files/download";
    $.ajax({
        type : "POST",
        url : $url,
        data : "data=" + JSON.stringify({data : {
            Cloud : {project : $('.projects-button').attr("data-project"), path : file, user: user},
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        dataType : "json",
        crossDomain : true
    })
    .success(function(data){
        window.location.href = "" + $url + "/" + data.token + "";
    })
    .fail(function(){
        alert('Erreur lors du téléchargement du fichier');
    });
}
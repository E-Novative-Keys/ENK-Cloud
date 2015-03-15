$(document).ready(function() {
    var row = undefined;

    listProjects();
    listFiles("client", btoa("/"));
    listFiles("dev", btoa("/"));

    // Liste des fichiers au click sur un dossier ou download d'un fichier
    $('table').on("click", ".file", function() {
        if($(this).attr("data-dir") == "true")
            listFiles($(this).attr("data-user"), $(this).attr("data-file"));
        else
            download($(this).attr("data-user"), $(this).attr("data-file"));
    });

    // Simulating File Upload click
    $('#btn-upload').click(function(e){
        e.preventDefault();
        $('#file-upload').click();
    });

    $('#file-upload').change(function(e){
        e.preventDefault();
        DnDFileUpload($(this)[0].files, undefined, $('#DnDStatus'), atob($('#storage').attr("data-dir")));
    });

    // Text area des commentaires

    $('table').on("mouseover", ".file", function() {
        if(row == undefined && $(this).attr("data-comment") != "")
            $('#comment')
                .attr("style", "visibility:visible;")
                .attr("readonly", true)
                .val($(this).attr("data-comment"));
    });

    $('table').on("mouseout", ".file", function() {
        if(row == undefined)
            $('#comment')
                .attr("style", "visibility:hidden;")
                .val("");
    });

    $('#edit-comment').on("click", function() {
        $.ajax({
            method: "POST",
            url : "http://enkwebservice.com/cloud/comment",
            data : 'data=' + JSON.stringify({data : {
                Cloud : {user : "client", project : $('.projects-button').attr("data-project"), file : $(this).attr("data-file"), comment : $('#comment').val()},
                Token : {link : $('#link').val(), fields : $('#fields').val()}
            }}),
            crossDomain: true,
            dataType : "json"
        }).success(function(data) {
            if(data.comment)
            {
                $('#comment').attr("style", "visibility:hidden;");
                $('#edit-comment').attr("style", "visibility:hidden;");

                row.attr("data-comment", $('#comment').val());
                row = undefined;
            }
        });
    });

    // Création d'un nouveau dossier dans le répertoire courant
    $('#new-dir').click(function() {
        folderCreate();
    });

    $('#storage').click(function() {
        listFiles('client', $(this).attr("data-dir"));
    });

    // Drag and Drop Zone
    
    // Stop propagation des events sur toute la page  
    $(document).on('dragenter dragover drop', function(e) {
        e.stopPropagation();
        e.preventDefault();
    });

    // Events sur les dossiers de la liste
    $('#client-files').on("dragenter", ".file", function(e) 
    {
        e.stopPropagation();
        e.preventDefault();
    });
    $('#client-files').on("dragover", ".file", function(e) {
        e.stopPropagation();
        e.preventDefault();
    });
    $('#client-files').on("drop", ".file", function(e) {
        e.preventDefault();
        DnDFileUpload(e.originalEvent.dataTransfer.files, $(this), $('#DnDStatus'));
    });
    $('#client-dropzone').on("drop", function(e) {
        e.preventDefault();
        DnDFileUpload(e.originalEvent.dataTransfer.files, $(this), $('#DnDStatus'));
    });

    // Sélection d'un projet
    $('.projects-button').on('click', '.project', function() {
        $('.projects-button').attr("data-project", $(this).attr("data-id"));
        listFiles("client", btoa("/"));
        listFiles("dev", btoa("/"));
    });

    // Champs de recherche
    $('#search').keyup(function(){
        listFiles("client", btoa("/"), $(this).val());
        listFiles("dev", btoa("/"), $(this).val());
    });

    // Menu contextuel au click droit
    $.contextMenu({
        selector: '#client-files .file', 
        callback: function(key, options) {
            if(key == "rename")
                renameFile($(this));
            else if(key == "delete")
                deleteFile($(this));
            else if(key == "comment")
            {
                row = $(this);
                $('#comment')
                    .attr("style", "visibility:visible;")
                    .attr("readonly", false)
                    .val($(this).attr("data-comment"));
                $('#edit-comment')
                    .attr("data-file", $(this).attr("data-file"))
                    .attr("style", "visibility:visible");
            }
        },
        items: {
            "rename": {name: "Renommer", icon: "edit"},
            "delete": {name: "Supprimer", icon: "delete"},
            "comment": {name: "Ajouter/Editer un commentaire", icon: "edit"}
        }
    });
});

function listFiles(user, dir, search) {
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
        {
            $('#client-dropzone')
                .attr("style", "height: calc(100% - " + $('#' + user + '-files').height() + "px - 1px);")
                .attr("data-dir", "true")
                .attr("data-file", $('#storage').attr("data-dir"));
        }
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

function download(user, file) {
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
        });
    }
}

function deleteFile(tr)
{
    var secure = confirm("Voulez-vous supprimer cet élément ?");

    if(secure)
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
$(document).ready(function() {
    var hidden_enable = true;

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

    $('table').on("mouseover", ".file", function() {
        if($(this).attr("data-comment") != "")
            $('#comment')
                .attr("style", "visibility:visible;")
                .attr("readonly", "readonly")
                .html($(this).attr("data-comment"));
    });

    $('table').on("mouseout", ".file", function() {
        if(hidden_enable)
            $('#comment')
                .attr("style", "visibility:hidden;")
                .html("");
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

    // Sélection d'un projet
    $('#projects-button').on('click', 'li', function() {
        $('projects-button').attr("data-project", $(this).attr("data-id"));
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
                hidden_enable = false;
                $('#comment').parent().append($('<input>')
                        .attr("type", "button")
                        .attr("value", "Editer")
                );
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
        var cloud = {project : $('#projects-button').attr("data-project"), directory : dir, search : search};
    else
        var cloud = {project : $('#projects-button').attr("data-project"), directory : dir};

    $('#storage').attr("data-dir", dir);

    if(user == 'client')
    {
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
    $url = "http://enkwebservice.com/cloud/files/download/";
    $.ajax({
        type : "POST",
        url : $url + "request",
        data : "data=" + JSON.stringify({data : {
            Cloud : {project : $('#projects-button').attr("data-project"), path : file, user: user},
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        dataType : "json",
        crossDomain : true
    })
    .success(function(data){
        window.location.href = "" + $url + data.token + "";
    })
    .fail(function(){
        alert('fail');
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
            url : "http://enkwebservice.com/cloud/" + tr.attr("data-user") + "/files/rename",
            data : "data=" + JSON.stringify({data : {
                Cloud : {project : $('#projects-button').attr("data-project"), directory : dir, name : name, rename : rename},
                Token : {link : $('#link').val(), fields : $('#fields').val()}
            }}),
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
            url : "http://enkwebservice.com/cloud/" + tr.attr("data-user") + "/files/delete",
            data : "data=" + JSON.stringify({data : { 
                Cloud : {project : $('#projects-button').attr("data-project"), directory : dir, name : name},
                Token : {link : $('#link').val(), fields : $('#fields').val()}
            }}),
            crossDomain : true
        })
        .success(function() {
            args.pop();
            listFiles(tr.attr("data-user"), btoa(args.join('/')));
        });
    }
}

function folderCreate()
{
    var name = prompt("Nouveau dossier", "");

    var dir = $('#storage').attr("data-dir");

    $.ajax({
        type : "POST",
        url : "http://enkwebservice.com/cloud/client/folder/add",
        data : "data=" + JSON.stringify({data : { 
            Cloud : {project : $('#projects-button').attr("data-project"), directory : dir, name : name},
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
                .attr("data-id", btoa(index))
                .append($('<a>')
                    .html(item)
                );

            $('#projects-button ul').append(li);
        });

        $('#projects-button').attr("data-project", $('#projects-button ul li:first-child').attr("data-id"));
    });
}
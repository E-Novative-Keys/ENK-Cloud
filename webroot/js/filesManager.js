/**
* Liste les fichiers des parties Cloud client/dev pour un projet donné suivant un répertoire courant
* @param user   (client/dev)
* @param dir    (répertoire courant)
* @param search (optionel : utilisé pour faire de la recherche récursive de fichiers -> barre de recherche)
*/
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

        // Ajout de chaque dossier/fichier dans le tableau correspondant
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
        
        // Dimension de la zone de drag and drop sous les dossiers/fichiers
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


/**
* Création d'un nouveau répertoire
* Rafraichit la liste des fichiers une fois le nouveau dossier créé
*/
function folderCreate() 
{
    var name = $('#dir').val();

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


/**
* Renomme un fichier/dossier
* Option visible dans le menu contextuel
* @param tr (objet tr contenant les informations du fichier/dossier à renommer)
*/
function renameFile(tr)
{
    $('#renameModal').modal('show');

    $('#renameSubmit').on('click', function(){
        var rename = $('#renameField').val();

        var dir     = atob(tr.attr("data-file"));
        var args    = dir.split('/');
        var name    = '';

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
            .fail(function(data){
                alert(/*JSON.stringify(data)*/"Le fichier/dossier ne peut pas être renommé car il existe déjà fichier du même nom.");
            });
        }
    });
    
}

/**
* Déplace un ou plusieurs fichiers
* Option visible dans le menu contextuel
* @param tr (objet tr contenant les informations des fichiers à déplacer)
*/
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
        })
        .fail(function(data) {
            alert(JSON.stringify(data));
        });
    });
}

/**
* Supprime un fichier/dossier
* Option visible dans le menu contextuel
* @param tr (objet tr contenant les informations du fichier/dossier à supprimer)
*/
function deleteFile(tr)
{
    $('#deleteModal').modal('show');

    $('#deleteSubmit').on('click', function(){

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
    });
}

/**
* Téléchargement d'un fichier
* Fonctionnement : 1 Requête Ajax -> reception token, 2 location.href url + token
* @param user (client/dev)
* @param file (chemin vers le fichier recherché)
*/
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
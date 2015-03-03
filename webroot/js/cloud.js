$(document).ready(function() {
    listFiles("client", btoa("/"));
    listFiles("dev", btoa("/"));

    // Liste des fichiers au click sur un dossier ou download d'un fichier
    $('table').on("click", ".file", function() {
        if($(this).attr("data-dir") == "true")
            listFiles($(this).attr("data-user"), $(this).attr("data-file"));
        else
            download($(this).attr("data-file"));
    });

    // Création d'un nouveau dossier dans le répertoire courant
    $('#new-dir').click(function() {
        folderCreate();
    });

    $('.file').filedrop({
        url: 'http://enkwebservice.com/cloud/client/files/add',
        paramname: 'file',
        data: {
            data : JSON.stringify({data : {
                Token : {link : $('#link').val(), fields : $('#fields').val()}
            }})
        },
        error: function(err, file) {
            switch(err) {
                case 'BrowserNotSupported':
                    alert('browser does not support HTML5 drag and drop')
                    break;
                case 'TooManyFiles':
                    // user uploaded more than 'maxfiles'
                    break;
                case 'FileTooLarge':
                    // program encountered a file whose size is greater than 'maxfilesize'
                    // FileTooLarge also has access to the file which was too large
                    // use file.name to reference the filename of the culprit file
                    break;
                case 'FileTypeNotAllowed':
                    // The file type is not in the specified list 'allowedfiletypes'
                    break;
                case 'FileExtensionNotAllowed':
                    // The file extension is not in the specified list 'allowedfileextensions'
                    break;
                default:
                    break;
            }
        },
        allowedfiletypes: ['image/jpeg','image/png','image/gif'],
        allowedfileextensions: ['.jpg','.jpeg','.png','.gif'], // file extensions allowed. Empty array means no restrictions
        maxfiles: 25,
        maxfilesize: 20
    });
    
    // Menu contextuel au click droit
    $.contextMenu({
        selector: '.file', 
        callback: function(key, options) {

            if(key == "rename")
                renameFile($(this));
            else if(key == "delete")
                deleteFile($(this));
        },
        items: {
            "rename": {name: "Renommer", icon: "edit"},
            "delete": {name: "Supprimer", icon: "delete"},
        }
    });
});

function listFiles(user, dir) {

    var ret = atob(dir).split('/');
    ret.pop();
    ret = (ret.join('/') == "") ? '/' : ret.join('/');

    $('#storage').attr("data-dir", dir);

    $('#previous_' + user)
        .attr("onclick", "listFiles('" + user + "', '" + btoa(ret) + "');");    

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
            var img = item.isDir ? 'directory' : item.extension;

            $('#' + user + '-files').find('tbody')
                .append($('<tr>')
                    .attr("data-file", btoa(((atob(dir) == "/") ? atob(dir) : atob(dir) + "/") + item.filename))
                    .attr("data-dir", item.isDir)
                    .attr("data-user", user)
                    .attr("class", "file")
                    .append($('<td>')
                        .html('<img src="img/icons/' + img + '.png" class="adaptated-src" /> ' + ((item.filename.length > 100) ? item.filename.substring(0, 100) + "..." : item.filename))
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
    .fail(function() {
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
        //document.location.href = 'data:application/octet-stream;content-disposition:attachment;filename=coucou.txt,' + encodeURIComponent(data);
        document.location.href = 'data:application/octet-stream,' + encodeURIComponent(data);
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

    $.ajax({
        type : "POST",
        url : "http://enkwebservice.com/cloud/" + tr.attr("data-user") + "/files/rename",
        data : "data=" + JSON.stringify({data : {
            Cloud : {project : 1, directory : dir, name : name, rename : rename},
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        crossDomain : true
    })
    .success(function() {
        args[args.length-1] = rename;
        tr.find('td:first-child').text(rename);
        tr.attr("data-file", btoa(args.join('/')));
    });
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
                Cloud : {project : 1, directory : dir, name : name},
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
    var name = prompt("New folder name", "");

    var dir = $('#storage').attr("data-dir");

    $.ajax({
        type : "POST",
        url : "http://enkwebservice.com/cloud/client/folder/add",
        data : "data=" + JSON.stringify({data : { 
            Cloud : {project : 1, directory : dir, name : name},
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        crossDomain : true
    })
    .done(function() {
        listFiles("client", dir);
    });
}
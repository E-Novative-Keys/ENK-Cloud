$(document).ready(function() {
    var row = undefined;

    listProjects();
    listFiles("client", btoa("/"));
    listFiles("dev", btoa("/"));

    // Liste des fichiers au click sur un dossier ou download d'un fichier
    $('table').on("dblclick", ".file", function() {
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
        })
        .success(function(data) {
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

    $('#client-files').selectable({
        filter:'.file'
    });

    // Sélection d'un projet
    $('.projects-button').on('click', '.project', function() {
        $('.projects-button .inline').text($(this).text());
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
            else if(key == "move")
                moveFile($(this));
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
            "move": {
                name: "Déplacer les éléments sélectionnés", 
                icon:"paste",
                disabled: function(){
                    if(this.attr("data-dir") == "true"
                    && !this.hasClass('ui-selected')
                    && $('.ui-selected').length != 0)
                        return false;
                    return true;
                }
            },
            "comment": {
                name: "Ajouter/Editer un commentaire",
                icon: "edit"
            }
        }
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
        });

        $('.projects-button .inline').text($('.projects-button ul .project:first-child').text());
        $('.projects-button').attr("data-project", $('.projects-button ul .project:first-child').attr("data-id"));
    });
}
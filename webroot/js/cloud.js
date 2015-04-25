$(document).ready(function() {
    var row = undefined;


    listProjects();

    listFiles("client", btoa("/"));
    listFiles("dev", btoa("/"));



    /*** Menu - Bar ***/

    /* Champs de recherche */

    // Evènement de recherche de fichiers à chaque touche appuyée
    $('#search').keyup(function(){
        listFiles("client", btoa("/"), $(this).val());
        listFiles("dev", btoa("/"), $(this).val());
    });

    /* Bouton Upload de fichiers */

    // Evènement au click sur le bouton 'Uploader un fichier'
    $('#btn-upload').click(function(e){
        e.preventDefault();
        $('#file-upload').click();
    });

    // Evènement lors de la validation de la fenêtre d'Upload de fichier
    // Va transmettre le fichier souhaité à la fonction d'envoi en ajax
    $('#file-upload').change(function(e){
        e.preventDefault();
        DnDFileUpload($(this)[0].files, undefined, $('#DnDStatus'), atob($('#storage').attr("data-dir")));
    });

    /* Bouton Espace de stockage */

    // Evènement permettant de rafraichir la liste de fichiers du le répertoire courant
    $('#storage').click(function() {
        listFiles('client', $(this).attr("data-dir"));
    });

    /* Bouton Création Nouveau Dossier */

    // Création d'un nouveau dossier dans le répertoire courant
    $('#new-dir').click(function() {
        folderCreate();
    });

    /* Bouton Sélection de Projet */

    // Affichage de la liste de fichiers clients/dev pour un projet sélectionné
    $('.projects-button').on('click', '.project', function() {
        $('.projects-button .inline').text($(this).text());
        $('.projects-button').attr("data-project", $(this).attr("data-id"));
        listFiles("client", btoa("/"));
        listFiles("dev", btoa("/"));
    });



    /*** Affichage des commentaires ***/

    // Evènement lors du passage de la souris sur un fichier/dossier de la liste
    // Va regarder si un commentaire existe et affiche un textarea si oui
    $('table').on("mouseover", ".file", function() {
        if(row == undefined && $(this).attr("data-comment") != "")
            $('#comment')
                .attr("style", "visibility:visible;")
                .attr("readonly", true)
                .val($(this).attr("data-comment"));
    });

    // Evènement lorsque la souris n'est plus sur le fichier/dossier qui cache la textarea
    $('table').on("mouseout", ".file", function() {
        if(row == undefined)
            $('#comment')
                .attr("style", "visibility:hidden;")
                .val("");
    });

    // Evènement au click pour l'enregistrement d'un commentaire (ajout/edition)
    $('#edit-comment').on("click", function() {
        $.ajax({
            method: "POST",
            url : "http://enkwebservice.com/cloud/comment",
            data : 'data=' + JSON.stringify({data : {
                Cloud : {user : "client", project : $('.projects-button').attr("data-project"),
                        file : $(this).attr("data-file"), comment : $('#comment').val()},
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



    /*** Gestion de la liste de fichiers ***/

    /* Liste de fichiers */

    // Evènement au double click sur un élément de la liste de fichiers/dossiers
    // Met à jour la liste de fichiers au double click sur un dossier
    // Télécharge le fichier au double click sur un fichier
    $('table').on("dblclick", ".file", function() {
        if($(this).attr("data-dir") == "true")
            listFiles($(this).attr("data-user"), $(this).attr("data-file"));
        else
            download($(this).attr("data-user"), $(this).attr("data-file"));
    });

    // Librairie jQuery permettant la selection de tr
    $('#client-files').selectable({
        filter:'.file'
    });

    /* Zone Drag and Drop */
    
    // Stop la propagation des events sur toute la page  
    $(document).on('dragenter dragover drop', function(e) {
        e.stopPropagation();
        e.preventDefault();
    });
    $('#client-files').on("dragenter", ".file", function(e) 
    {
        e.stopPropagation();
        e.preventDefault();
    });
    $('#client-files').on("dragover", ".file", function(e) {
        e.stopPropagation();
        e.preventDefault();
    });

    // Drag and Drog de fichiers sur fichiers/dossiers de la liste du client
    $('#client-files').on("drop", ".file", function(e) {
        e.preventDefault();
        DnDFileUpload(e.originalEvent.dataTransfer.files, $(this), $('#DnDStatus'));
    });

    // Drag and Drog de fichiers sur dans la zone de la liste du client (hors fichiers/dossiers)
    $('#client-dropzone').on("drop", function(e) {
        e.preventDefault();
        DnDFileUpload(e.originalEvent.dataTransfer.files, $(this), $('#DnDStatus'));
    });



    /*** Menu Contextuel ***/

    // Menu présent au click droit sur fichiers/dossiers du cloud client
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


/**
* Affiche la liste des projets de l'utilisateur courant dans un sélecteur de projets
* !! async : false, les données récupérées en Ajax sont nécessaires au fonctionnement
* d'autres requêtes ajax, il est donc primordial d'avoir une execution synchrone
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
        });

        $('.projects-button .inline').text($('.projects-button ul .project:first-child').text());
        $('.projects-button').attr("data-project", $('.projects-button ul .project:first-child').attr("data-id"));
    });
}
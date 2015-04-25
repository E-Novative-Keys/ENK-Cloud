/**
* Préparation à l'envoi de fichiers en Ajax, création d'un objet FormData contenant le fichier
* Appel des fonctions de statusBar et d'envoi en Ajax
* @param files  (liste de fichiers à uploader)
* @param tr     (objet tr contenant les informations du dossier de destination des fichiers à uploader)
* @param obj    (objet/endroit de création de la status bar de progression)
* @param directory (optionel, répertoire d'upload différent)
*/
function DnDFileUpload(files, tr, obj, directory)
{
    // Boucle sur la liste de fichiers, envoi fichier par fichier
    for(var i = 0; i < files.length; i++) 
    {
        if(tr != undefined)
        {
            var dir = atob(tr.attr("data-file"));

            var args = dir.split('/');
            var name = '';

            if(tr.attr("data-dir") == "false")
            {
                name = args[args.length-1];
                dir = dir.replace(args[args.length-1], '');
            }
        }
        else
            var dir = directory;

        var fd = new FormData();
        fd.append('file', files[i]);

        var token = JSON.stringify({data : {
            Cloud : {project : $('.projects-button').attr("data-project"), directory : btoa(dir)},
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }});

        fd.append('data', token);

        var status = new createStatusbar(obj);
        status.setData(files[i].name, files[i].size);

        sendFileToServer(fd, status, btoa(dir));
    }
}

/**
* Création de la barre de progression de l'upload du fichier
* @param obj    (objet/endroit de création de la status bar de progression)
*/
function createStatusbar(obj)
{
    this.statusbar      = $("<div class=\"progress DnDProgress\"></div>");
    this.progressBar    = $("<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:0%\"></div>")
                            .appendTo(this.statusbar);
    this.percent        = $("<span class=\"DnDPercent\">0%</span>").appendTo(this.statusbar);
    this.abort          = $("<span class=\"glyphicon glyphicon-trash DnDTrash\"></span>").appendTo(this.statusbar);
    this.label          = $("<span class=\"DnDLabel\"></span>").appendTo(this.statusbar);

    this.name           = undefined;
    this.size           = undefined;

    obj.append(this.statusbar);
 
    this.setData = function(name,size) {
        this.size = $("<span>").html(size).filesize().html();
        this.name = name;

        this.label.html(this.name + " " + this.size);
    }

    this.setProgress = function(progress) {       
        var progressBarWidth = progress * this.progressBar.width() / 100;

        this.progressBar.attr("aria-valuenow", progress);
        this.progressBar.attr("style", "width:" + progress + "%;");
        this.percent.html(progress + "%");

        if(parseInt(progress) >= 100)
        {
            this.abort.hide();
            this.statusbar.delay(1000).fadeOut(3000, function(){
                $(this.statusbar).remove();
            });
        }
    }

    this.setAbort = function(jqxhr) {
        var sb = this.statusbar;

        this.abort.click(function() {
            jqxhr.abort();
            sb.hide();
        });
    }
}

/**
* Envoi du fichier au serveur, Mise à jour en temps réel de la barre de progression
* @param formData   (objet formdata contenant le fichier à uploader et les token)
* @param status     (barre de progression)
* @param dir        (répertoire d'upload du fichier)
*/
function sendFileToServer(formData, status, dir)
{
    var jqxhr = $.ajax({
        type: "POST",
        url: "http://enkwebservice.com/cloud/files/add",
        data: formData,
        crossDomain : true,
        contentType: false,
        processData: false,
        xhr: function() {
            var xhrobj = $.ajaxSettings.xhr();
            if(xhrobj.upload) {
                xhrobj.upload.addEventListener('progress', function(event) {
                    var percent     = 0;
                    var position    = event.loaded || event.position;
                    var total       = event.total;
                    
                    if(event.lengthComputable)
                        percent     = Math.ceil(position / total * 100);
                    
                    // Set progress
                    status.setProgress(percent);
                }, false);
            }
            return xhrobj;
        },
        success: function(data) {
            if(JSON.stringify(data) == '{"upload":"success"}')
            {
                status.progressBar.attr("class", "progress-bar progress-bar-success");
                listFiles("client", dir); 
            }
            else
            {
                status.progressBar.attr("class", "progress-bar progress-bar-danger");
                status.setProgress(100);
                status.percent.html("");
            }         
        }
    });

    status.setAbort(jqxhr);
}
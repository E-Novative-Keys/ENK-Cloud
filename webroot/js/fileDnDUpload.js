function DnDFileUpload(files, obj)
{
    for(var i = 0; i < files.length; i++) 
    {
        var fd = new FormData();
        fd.append('file', files[i]);

        var status = new createStatusbar(obj);
        status.setData(files[i].name,files[i].size);
        //sendFileToServer(fd,status);
    }
}

function createStatusbar(obj)
{
    /*this.statusbar      = $("<div class='DnDstatusbar'></div>");
    this.filename       = $("<div class='DnDfilename'></div>").appendTo(this.statusbar);
    this.size           = $("<div class='DnDfilesize'></div>").appendTo(this.statusbar);
    this.progressBar    = $("<div class='DnDprogressBar'><div></div></div>").appendTo(this.statusbar);
    this.abort          = $("<div class='DnDabort'>Abort</div>").appendTo(this.statusbar);*/

    this.statusbar      = $("<div class=\"progress\"></div>");
    this.progressBar    = $("<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"50\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:50%\"></div>")
                            .html("")
                            .appendTo(this.statusbar);
    this.percent        = $("<span class=\"DnDPercent\">0%</span>").appendTo(this.statusbar);
    this.abort          = $("<span class=\"glyphicon glyphicon-trash DnDTrash\"></span>").appendTo(this.statusbar);
    this.label          = $("<span class=\"DnDLabel\"></span>").appendTo(this.statusbar);

    obj.append(this.statusbar);
 
    this.setData = function(name,size) {
        size = $("<span>").html(size).filesize().html();
        this.label.html(name + " " + size);
    }

    this.setProgress = function(progress) {       
        var progressBarWidth = progress * this.progressBar.width() / 100;

        this.progressBar
            .animate({width: progressBarWidth}, 10)
            /*.html(progress + "%")*/;
        this.percent.html(progress + "%");

        if(parseInt(progress) >= 100)
        {
            this.abort.hide();
            this.progressBar.attr("class", "progress-bar progress-bar-success");
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
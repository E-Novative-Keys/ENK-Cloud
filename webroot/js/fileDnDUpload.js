function DnDFileUpload(files, obj)
{
    for(var i = 0; i < files.length; i++) 
    {
        var fd = new FormData();
        fd.append('file', files[i]);

        var token = JSON.stringify({data : {
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }});

        fd.append('data', token);

        var status = new createStatusbar(obj);
        status.setData(files[i].name, files[i].size);

        sendFileToServer(fd,status);
    }
}

function createStatusbar(obj)
{
    this.statusbar      = $("<div class=\"progress DnDProgress\"></div>");
    this.progressBar    = $("<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"50\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:50%\"></div>")
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

        this.progressBar.animate({width: progressBarWidth}, 10);
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

function sendFileToServer(formData, status)
{
    var jqxhr = $.ajax({
        type: "POST",
        url: "http://enkwebservice.com/cloud/client/files/add",
        data: formData,
        crossDomain : true,
        contentType: false,
        processData: false,
        /*xhr: function() {
            var xhrobj = $.ajaxSettings.xhr();
            if(xhrobj.upload) {
                xhrobj.upload.addEventListener('progress', function(event) {
                    var percent = 0;
                    var position = event.loaded || event.position;
                    var total = event.total;
                    if (event.lengthComputable) {
                        percent = Math.ceil(position / total * 100);
                    }
                    
                    // Set progress
                    //status.setProgress(percent);
                }, false);
            }
            return xhrobj;
        }*/
        success: function(data) {
            console.log(data);
        }
    });

    status.setAbort(jqxhr);
}

/*
function sendFileToServer(formData, status)
{
    var jqXHR = $.ajax({
        type: "POST",
        url: "http://enkwebservice.com/cloud/client/files/add",
        data: formData,
        crossDomain : true,
        contentType: false,
        processData: false,
        xhr: function() {
            var xhrobj = $.ajaxSettings.xhr();
            if(xhrobj.upload) {
                xhrobj.upload.addEventListener('progress', function(event) {
                    var percent = 0;
                    var position = event.loaded || event.position;
                    var total = event.total;
                    if (event.lengthComputable) {
                        percent = Math.ceil(position / total * 100);
                    }
                    
                    // Set progress
                    status.setProgress(percent);
                }, false);
            }
            return xhrobj;
        },
        success : function(data) {
            status.setProgress(100);;
        }
    });
    status.setAbort(jqXHR);
}*/

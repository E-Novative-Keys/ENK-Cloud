function listMails()
{
	if($('#email').attr("data-type") == "received")
        $url = "http://enkwebservice.com/mailbox/";
    else if($('#email').attr("data-type") == "sent")
        $url = "http://enkwebservice.com/mailbox/sent";
    else
        return;

    $.ajax({
        type : "POST",
        url : $url,
        data : 'data=' + JSON.stringify({data : {
            Mail : {project : $('.projects-button').attr("data-project")},
            Token : {link : $('#link').val(), fields : $('#fields').val()}
        }}),
        crossDomain: true,
        dataType : "json"
    })
    .success(function(data) {
        $('#mails').find('tbody').empty();

        $.each(data.mails, function(index, item) {
            $('#mails').find('tbody')
                .append($('<tr>')
                    .attr("data-from", "L'équipe de dev")
                    .attr("data-object", item.object)
                    .attr("data-content", item.content)
                    .attr("data-date", item.created)
                    .attr("class", "mail")
                    .append($('<td>')
                        .text("L'équipe de dev")
                    )
                    .append($('<td>')
                        .text(item.object)
                    )
                    .append($('<td>')
                        .text(item.created)
                    )
                );
        });
    })
    .fail(function(data) {
        $('#mails').find('tbody').empty();
        $('#mails').find('tbody')
            .append($('<tr>')
                .append($('<td>')
                    .attr("colspan", 3)
                    .attr("class", "center")
                    .text("Une erreur est survenue lors de la récupération de la liste d'emails")
                )
            )
    });
}

function deleteMail()
{

}

function mailDetails(mail)
{
    $('#details').empty();

    $('#details')
        .append($('<h4>')
            .text("Objet : " + mail.attr("data-object"))
        )
        .append($('<h4>')
            .text("De : " + mail.attr("data-from"))
        )
        .append($('<h4>')
            .text("Date : " + mail.attr("data-date"))
        )
        .append($('<div>')
            .text(mail.attr("data-content"))
        )
}
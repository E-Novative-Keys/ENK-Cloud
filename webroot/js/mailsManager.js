/**
* Affiche la liste de messages reçus/envoyés dans le tableau approprié selon la page concernée
*/
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
                    .attr("data-id", btoa(item.id))
                    .attr("data-from", item.from)
                    .attr("data-object", item.object)
                    .attr("data-content", item.content)
                    .attr("data-date", item.created)
                    .attr("class", "mail")
                    .append($('<td>')
                        .text(item.from)
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

/**
* Supprime le message reçu/envoyé et raffiche la liste de messages reçus/envoyés après
* Option visible dans le menu contextuel
* @param mail (objet/tr contenant les informations data-id, data-content, ... du message à supprimer)
*/
function deleteMail(mail)
{
    if(confirm("Voulez-vous supprimer cet e-mail ?"))
    {
        $.ajax({
            type : "POST",
            url : "http://enkwebservice.com/mailbox/delete",
            data : 'data=' + JSON.stringify({data : {
                Mail : {id : mail.attr("data-id")},
                Token : {link : $('#link').val(), fields : $('#fields').val()}
            }}),
            crossDomain: true,
            dataType : "json"
        })
        .success(function(data) {
            listMails();
        });
    }
}

/**
* Affiche les détails d'un message dans la zone appropriée
* @param mail   (objet/tr contenant les informations data-from, data-object, data-date, data-content du message à afficher)
*/
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
        );
}
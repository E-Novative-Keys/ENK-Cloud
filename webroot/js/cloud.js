$(document).ready(function(){
  $.ajax({
    type : "POST",
    url : "http://enkwebservice.com/cloud/files/client",
    data : 'data=' + JSON.stringify({data : {Cloud : {project : 1, directory : '/'}, Token : {link : $('#link').val(), fields : $('#fields').val()}}}),
    crossDomain: true,
    dataType : "html"
  })
  .done(function(html) {
    $("#client_files").append(html);
  });
});
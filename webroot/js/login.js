$(document).ready(function(){
  $flag = false;

  $(document).mousemove(function(e){
     event = e || window.event;
     TweenLite.to($('body'), 
        .5, 
        { css: 
            {
                backgroundPosition: ""+ parseInt(event.pageX/8) + "px "+parseInt(event.pageY/'12')+"px, "+parseInt(event.pageX/'15')+"px "+parseInt(event.pageY/'15')+"px, "+parseInt(event.pageX/'30')+"px "+parseInt(event.pageY/'30')+"px"
            }
        });
  });

  $(".alert").delay(1000).fadeOut(3000, function(){
    $(".alert").alert('close');
  });

  $('#forgot').click(function(e){
    $(this)
      .attr("style", "display:none")
    $('#submit')
        .attr("type", "button")
        .attr("value", "Envoyer");
    $('#passwd').attr("style", "visibility:hidden");
    $('#return').attr("style", "display:block");
    $('.checkbox label').html("Forgot Password :"); 
  });

  $('#return').click(function(e){
    $(this)
      .attr("style", "display:none")
    $('#submit')
        .attr("type", "submit")
        .attr("value", "Login");
    $('#passwd').attr("style", "visibility:visible");
    $('#forgot').attr("style", "display:block");
    $('.checkbox label').html("Connexion :"); 
  });

  $('#submit').click(function(){
    if($flag)
    {
      $.ajax({
        method: "POST",
        url : "http://enkwebservice.com/users/token",
        data : 'data=' + JSON.stringify({data : {
            Client : {email : $('#email').val()}
        }}),
        crossDomain: true
      })
      .success(function(){
        window.location.reload();
      });
    }
  });

 
});
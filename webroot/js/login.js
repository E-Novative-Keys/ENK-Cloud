$(document).ready(function(){
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
});
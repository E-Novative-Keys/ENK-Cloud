$(document).ready(function(){
	$flag = false;

	$(document).mousemove(function(e){
		event = e || window.event;
		TweenLite.to($('body'), .5, { 
			css: {
				backgroundPosition: ""+ parseInt(event.pageX/8) + "px "+parseInt(event.pageY/'12')+"px, "+parseInt(event.pageX/'15')+"px "+parseInt(event.pageY/'15')+"px, "+parseInt(event.pageX/'30')+"px "+parseInt(event.pageY/'30')+"px"
			}
		});
	});

	$(".alert").delay(1000).fadeOut(3000, function(){
		$(".alert").alert('close');
	});

	$('#forgot').click(function(e){
		$flag = true;
		$(this).attr("style", "display:none;");
		$('#submit')
			.attr("type", "button")
			.attr("value", "Envoyer");
		$('#passwd').attr("style", "visibility:hidden;");
		$('#return').attr("style", "display:block;");
		$('.checkbox label').html("Forgot Password :"); 
	});

	$('#return').click(function(e){
		$flag = false;
		$(this).attr("style", "display:none;");
		$('#submit')
			.attr("type", "submit")
			.attr("value", "Login");
		$('#passwd').attr("style", "visibility:visible;");
		$('#forgot').attr("style", "display:block;");
		$('.checkbox label').html("Connexion :"); 
	});

	$('#submit').click(function(){
		if($flag)
		{
			if($('#email').val().length > 0 && $('#email').val().match("^[_a-zA-Z0-9-]+(.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)+$"))
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
					$('#return').click();
					$('body').append(
						$('<div>')
							.attr("class", "alert alert-success")
							.attr("style", "z-index: 1000; position: fixed; top: 35px; right: 20px; width: 15%;")
							.append(
								$('<a>')
									.attr("href", "#")
									.attr("class", "close")
									.attr("data-dismiss", "alert")
									.text("x")
							)
							.append($('<strong>').text("Success : "))
							.append("Un lien de réinitialisation de mot de passe vous a été envoyé par mail")	
					);
				});
			}
			else
			{
				$('body').append(
					$('<div>')
						.attr("class", "alert alert-danger")
						.attr("style", "z-index: 1000; position: fixed; top: 35px; right: 20px; width: 15%;")
						.append(
							$('<a>')
								.attr("href", "#")
								.attr("class", "close")
								.attr("data-dismiss", "alert")
								.text("x")
						)
						.append($('<strong>').text("Error : "))
						.append("L'adresse e-mail saisie est invalide")	
				);
			}
		}
	});
});
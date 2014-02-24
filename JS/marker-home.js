$(".link").css('cursor', 'pointer');

$(".link").click(function(){
	$("#chosen-student-div").show();
	$("#chosen-student-text").text(($(this).text()));
});



var settings = {
	username: "Fodase",
	team: "left",
	theme: "dark",
	screenSize: 3
};

$("input[name=teamButton]").click(() => {
	var aux = $("input[name=teamButton]");
	if(aux.val() == "Right")
    	aux.val("Left");
  	else
    	aux.val("Right");
    $("input[name=team]").val(aux.val());
});
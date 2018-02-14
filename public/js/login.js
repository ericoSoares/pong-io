//Settings slide (open or closed)
var slide = false;

//Team button
$("input[name=teamButton]").click(() => {
  if($("input[name=teamButton]").val() == "Right")
    $("input[name=teamButton]").val("Left");
  else
    $("input[name=teamButton]").val("Right");
  $("input[name=team]").val($("input[name=teamButton]").val().toLowerCase());
});

//Settings button
$("input[name=settings]").click(() => {
  if(!slide) {
    $("#settingsList").slideDown(300);
    $("input[name=settings]").addClass("hovered");
    slide = true;
  } else {
    $("#settingsList").slideUp(300);
    $("input[name=settings]").removeClass("hovered");
    slide = false;
  }
}); 

//Theme option in the settings
$("#theme").click(() => {
  var theme = $("#theme");
  if(theme.text() == "Theme: Dark") {
    theme.text("Theme: Light");
    $('link[href="/stylesheets/loginStyle.css"]').attr('href','/stylesheets/loginStyleLight.css');
  }
  else {
    theme.text("Theme: Dark");
    $('link[href="/stylesheets/loginStyleLight.css"]').attr('href','/stylesheets/loginStyle.css');
  }
  $("input[name=theme]").val(theme.text().includes("Dark") ? "dark": "light");
});

//Hide names option in the settings
$("#displayNames").click(() => {
  var el = $("#displayNames");
  if($("i").length == 0) {
    el.append('<i class="fa fa-check" aria-hidden="true"></i>');
    $("input[name=displayNames]").val("false");
  } else {
    el.children("i").remove();
    $("input[name=displayNames]").val("true");
  }
});
var socket = io.connect('http://localhost:3000');
var canvas = document.getElementById('board');
var ctx    = canvas.getContext('2d');

$("#board").click((ev) => {
	socket.emit('action', {
		xPos: ev.pageX - $('#board').offset().left,
		yPos: ev.pageY - $('#board').offset().top
	});
});

socket.on('action', (data) => {
	ctx.beginPath();
	ctx.arc(data.xPos,data.yPos,10,0,2*Math.PI);
	ctx.fill();
});
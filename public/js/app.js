var socket = io.connect('http://localhost:3000');
var canvas = document.getElementById('board');
var ctx    = canvas.getContext('2d');

$("#board").mousemove((ev) => {
	socket.emit('action', {
		xPos: ev.pageX - $('#board').offset().left,
		yPos: ev.pageY - $('#board').offset().top
	});
});

socket.on('update', (data) => {
	updateCanvas(data);
});

socket.on('ballmove', (data) => {
	updateCanvas(data);
});

function updateCanvas(data) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < data.players.length; i++) {
		ctx.beginPath();
		ctx.arc(data.players[i].xPos,data.players[i].yPos,10,0,2*Math.PI)
		ctx.fillStyle = "black";
		ctx.fill();
	}
	ctx.beginPath();
	ctx.arc(data.ball.xPos,data.ball.yPos,10,0,2*Math.PI);
	ctx.fillStyle = data.ball.color;
	ctx.fill();
}
	

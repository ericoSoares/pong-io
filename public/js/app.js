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

function updateCanvas(data) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawText(data);
	drawPlayers(data);
	drawBall(data);
}

function drawText(data) {
	ctx.fillStyle = data.status.leftColor;
	ctx.font = "bold 60px Monospace";
	ctx.fillText(data.status.leftScore, ((canvas.width)*0.25)-20, 58);
	ctx.fillStyle = data.status.rightColor;
	ctx.font = "bold 60px Monospace";
	ctx.fillText(data.status.rightScore, ((canvas.width)*0.75)-20, 58);
	var onlineStr = data.players.length + " player";
	onlineStr += (data.players.length == 1) ? " online!" : "s online!";
	ctx.fillStyle = "black";
	ctx.font = "bold 20px Monospace";
	ctx.fillText(onlineStr, 20, canvas.height-20);

}

function drawPlayers(data) {
	for(var i = 0; i < data.players.length; i++) {
		ctx.beginPath();
		ctx.arc(data.players[i].xPos,data.players[i].yPos,10,0,2*Math.PI);
		ctx.fillStyle = data.players[i].color;
		ctx.fill();
	}
}

function drawBall(data) {
	ctx.beginPath();
	ctx.arc(data.ball.xPos,data.ball.yPos,data.ball.radius,0,2*Math.PI);
	ctx.fillStyle = data.ball.color;
	ctx.fill();
}
	
window.onbeforeunload = function(e) {
	socket.disconnect(0);
};	
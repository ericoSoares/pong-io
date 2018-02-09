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
	drawBall(data);
	drawText(data);
	drawLines()
	drawPlayers(data);
}

function drawText(data) {
	ctx.textAlign = "center"; 
	ctx.fillStyle = data.status.leftColor;
	ctx.font = "bold 60px Monospace";
	ctx.fillText(data.status.leftScore, ((canvas.width)*0.25), 70);
	ctx.fillStyle = data.status.rightColor;
	ctx.font = "bold 60px Monospace";
	ctx.fillText(data.status.rightScore, ((canvas.width)*0.75), 70);
	var onlineStr = data.players.length + " player";
	onlineStr += (data.players.length == 1) ? " online!" : "s online!";
	ctx.textAlign = "start";
	ctx.fillStyle = "white";
	ctx.font = "bold 20px Monospace";
	ctx.fillText(onlineStr, 20, canvas.height-20);
}

function drawLines() {
	ctx.fillStyle = "white";
	for(var i = 0; i < canvas.height; i+= 120) {
		ctx.rect(canvas.width/2 - 5, i, 10, 60);
		ctx.fill();
	}
	ctx.rect(0, 0, canvas.width, 10);
	ctx.fill();
	ctx.rect(0, canvas.height-10, canvas.width, 10);
	ctx.fill();
	ctx.rect(0, 0, 10, canvas.height);
	ctx.fill();
	ctx.rect(canvas.width-10, 0, 10, canvas.height);
	ctx.fill();
}

function drawPlayers(data) {
	for(var i = 0; i < data.players.length; i++) {
		ctx.fillStyle = data.players[i].color;
		ctx.beginPath();
		ctx.arc(data.players[i].xPos,data.players[i].yPos,10,0,2*Math.PI);
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.textAlign = "center";  
		ctx.font = "bold 15px Monospace";
		ctx.fillText(data.players[i].name, data.players[i].xPos, data.players[i].yPos-20);
		ctx.textAlign = "start";
	}
}

function drawBall(data) {
	ctx.fillStyle = data.ball.color;
	ctx.beginPath();
	ctx.arc(data.ball.xPos,data.ball.yPos,data.ball.radius,0,2*Math.PI);
	ctx.fill();
}
	
/*window.onbeforeunload = function(e) {
	socket.disconnect(0);
};*/	
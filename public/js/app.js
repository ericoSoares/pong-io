//Makes socket connection
var socket = io.connect('/');
//Gets the canvas and the canvas context
var canvas = document.getElementById('board');
var ctx    = canvas.getContext('2d');
//When the player moves the mouse in the canvas, emit the x and y postion to the server
$("#board").mousemove((ev) => {
	socket.emit('action', {
		xPos: ev.pageX - $('#board').offset().left,
		yPos: ev.pageY - $('#board').offset().top
	});
});

//Receives update from the server
socket.on('update', (data) => {
	updateCanvas(data);
});

//Clears the canvas and draws the elements in their new positions
function updateCanvas(data) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall(data);
	drawText(data);
	drawLines(data)
	drawPlayers(data);
}

//Draw the texts (scores and quantity os players online)
function drawText(data) {
	//Draws left score
	ctx.textAlign = "center"; 
	ctx.fillStyle = data.status.leftColor;
	ctx.font = "bold 60px Monospace";
	ctx.fillText(data.status.leftScore, ((canvas.width)*0.25), 70);
	//Draws right score
	ctx.fillStyle = data.status.rightColor;
	ctx.font = "bold 60px Monospace";
	ctx.fillText(data.status.rightScore, ((canvas.width)*0.75), 70);
	//Draws "players online"
	var onlineStr = data.players.length + " player";
	onlineStr += (data.players.length == 1) ? " online!" : "s online!";
	ctx.textAlign = "start";
	ctx.fillStyle = (data.sets.theme == "dark") ? "white" : "black";
	ctx.font = "bold 20px Monospace";
	ctx.fillText(onlineStr, 20, canvas.height-20);
}

//Draws the border and center lines
function drawLines(data) {
	//Choose line color based on the player settings
	ctx.fillStyle = (data.sets.theme == "dark") ? "white" : "black";
	//Draws the central lines
	for(var i = 0; i < canvas.height; i+= 120) {
		ctx.rect(canvas.width/2 - 5, i, 10, 60);
		ctx.fill();
	}
	//Top line
	ctx.rect(0, 0, canvas.width, 10);
	ctx.fill();
	//Bottom line
	ctx.rect(0, canvas.height-10, canvas.width, 10);
	ctx.fill();
	//Left line
	ctx.rect(0, 0, 10, canvas.height);
	ctx.fill();
	//Right line
	ctx.rect(canvas.width-10, 0, 10, canvas.height);
	ctx.fill();
}

//Draws all the connected players
function drawPlayers(data) {
	for(var i = 0; i < data.players.length; i++) {
		ctx.fillStyle = data.players[i].color;
		ctx.beginPath();
		ctx.arc(data.players[i].xPos,data.players[i].yPos,10,0,2*Math.PI);
		ctx.fill();
		//Draws the player names or not based on the player settings
		if(data.sets.displayNames == "true") {
			ctx.fillStyle = (data.sets.theme == "dark") ? "white" : "black";
			ctx.textAlign = "center";  
			ctx.font = "bold 15px Monospace";
			ctx.fillText(data.players[i].name, data.players[i].xPos, data.players[i].yPos-20);
			ctx.textAlign = "start";
		}
	}
}

//Draws ball
function drawBall(data) {
	ctx.fillStyle = data.ball.color;
	ctx.beginPath();
	ctx.arc(data.ball.xPos,data.ball.yPos,data.ball.radius,0,2*Math.PI);
	ctx.fill();
}
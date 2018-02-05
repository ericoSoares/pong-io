var express = require('express');
var socket = require('socket.io');
var app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render(__dirname + '/public/views/home');
});

var server = app.listen(process.env.PORT || 3000, () => {
	console.log("Listening to port 3000");
});

var io = socket(server);
var players = [];
var ball = {
	xPos: 250,
	yPos: 250,
	speed: 1,
	color: "red"
};
io.on('connection', (socket) => {
	console.log('Made socket connection' + socket.id);
	var player = {
		id: socket.id,
		xPos: 0,
		yPos: 0,
		team: "right"
	};
	players.push(player);

	socket.on('action', (data) => {
		console.log(data);
		for(var i = 0; i < players.length; i++) {
			if(players[i].id == player.id) {
				if(players[i].team == "left") {
					players[i].xPos = (data.xPos > 250)?250:data.xPos;
					players[i].yPos = data.yPos;
				} else {
					players[i].xPos = (data.xPos < 250)?250:data.xPos;
					players[i].yPos = data.yPos;
				}
			}
		}
		io.sockets.emit('update', {players: players, ball: ball});
	});

	setInterval(() => {
		if(ball.xPos < 500 && ball.yPos < 500) {
			ball.xPos++;
			ball.yPos++;
			ball.speed -= 0.1;
		} else {
			ball.xPos = 250;
			ball.yPos = 250;
			ball.speed = 1;
		}
		io.sockets.emit('update', {players: players, ball: ball});
	}, 1000/60);
});
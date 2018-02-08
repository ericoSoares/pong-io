var express = require('express');
var socket  = require('socket.io');
var ball    = require('./config/ball.js');
var gameCfg = require('./config/gameConfig.js');
var canvasCfg = require('./config/canvasConfig.js');
var app     = express();

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
var interval;
io.on('connection', (socket) => {
	console.log('Made socket connection ' + socket.id);
	if(interval) clearInterval(interval);
	let randomTeam = (Math.random() >= 0.5) ? "left":"right";
	var player = {
		id: socket.id,
		xPos: 0,
		yPos: 0,
		team: randomTeam,
		color: (randomTeam == "left") ? gameCfg.leftColor : gameCfg.rightColor
	};
	players.push(player);

	socket.on('action', (data) => {
		for(var i = 0; i < players.length; i++) {
			if(players[i].id == player.id) {
				let halfCanvas = canvasCfg.width/2;
				if(players[i].team == "left") {
					players[i].xPos = (data.xPos > halfCanvas-15)?halfCanvas-15:data.xPos;
					players[i].yPos = data.yPos;
				} else {
					players[i].xPos = (data.xPos < halfCanvas+15)?halfCanvas+15:data.xPos;
					players[i].yPos = data.yPos;
				}
			}
		}
		io.sockets.emit('update', {players: players, ball: ball, status: gameCfg});
	});

	interval = setInterval(() => {
		switch(ball.checkScore()) {
			case "left": 
				gameCfg.leftScore++; 
				ball.resetBall();
				break;
			case "right": 
				gameCfg.rightScore++; 
				ball.resetBall();
				break;
			default: break;
		}
		if(gameCfg.checkEndMatch()) {
			ball.resetBall();
			gameCfg.resetScore();
		}
		ball.move();
		ball.checkHit(players);
		io.sockets.emit('update', {players: players, ball: ball, status: gameCfg});
	}, 1000/60);

	socket.on('disconnect', () => {
		players.splice(players.indexOf(socket.id), 1);
		clearInterval(interval);
	  	console.log('User disconnected! '+socket.id);
	});
});
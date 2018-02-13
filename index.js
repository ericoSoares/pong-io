var express 		 = require('express');
var socket  		 = require('socket.io');
var ball    		 = require('./config/ball.js');
var gameCfg 		 = require('./config/gameConfig.js');
var canvasCfg 		 = require('./config/canvasConfig.js');
var bodyParser       = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app     		 = express();
var playerSettings;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render(__dirname + '/public/views/login');
});
app.post('/', urlencodedParser, (req, res) => {
	playerSettings = req.body;
	console.log(playerSettings);
	res.render(__dirname + '/public/views/home', {theme: playerSettings, size: canvasCfg});
});

var server = app.listen(process.env.PORT || 3000, () => {
	console.log("Listening to port 3000");
});

var io = socket(server);
var players = [];
var interval;

io.sockets.on('connection', (socket) => {
	console.log('Made socket connection ' + socket.id);
	if(interval) clearInterval(interval);
	let randomTeam = (Math.random() >= 0.5) ? "left":"right";
	var player = {
		name: playerSettings.username,
		id: socket.id,
		xPos: 0,
		yPos: 0,
		team: playerSettings.team,
		theme: playerSettings.theme,
		screenSize: playerSettings.screenSize,
		displayNames: playerSettings.displayNames,
		color: (playerSettings.team == "left") ? gameCfg.leftColor : gameCfg.rightColor
	};
	players.push(player);
	console.log(players);
	socket.on('action', (data) => {
		gameCfg.moveInbound(data, players, player);
		for(var i in players) {
			io.sockets.connected[players[i].id].emit('update', {players: players, ball: ball, status: gameCfg, sets: players[i]});
			//socket.to(players[i].id).emit('update', {players: players, ball: ball, status: gameCfg});
		}
		//io.sockets.emit('update', {players: players, ball: ball, status: gameCfg});
	});

	interval = setInterval(() => {
		ball.strandedBall();
		switch(ball.checkScore()) {
			case "left": 
				gameCfg.leftScore++; 
				ball.resetBallScore("left");
				break;
			case "right": 
				gameCfg.rightScore++; 
				ball.resetBallScore("right");
				break;
			default: break;
		}
		if(gameCfg.checkEndMatch()) {
			ball.resetBall();
			gameCfg.resetScore();
		}
		ball.move();
		ball.checkHit(players);
		for(var i in players) {
			io.sockets.connected[players[i].id].emit('update', {players: players, ball: ball, status: gameCfg, sets: players[i]});
		}
	}, 1000/60);

	socket.on('disconnect', () => {
		let del;
		for(var i = 0; i < players.length; i++) {
			if(players[i].id == socket.id)
				del = i;
		}
		console.log("Player of id" + del + " disconnected!");
		players.splice(del, 1);
		//clearInterval(interval);
	});
});
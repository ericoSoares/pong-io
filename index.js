var express 		 = require('express');
var socket  		 = require('socket.io');
var ball    		 = require('./config/ball.js');
var gameCfg 		 = require('./config/gameConfig.js');
var canvasCfg 		 = require('./config/canvasConfig.js');
var bodyParser       = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app     		 = express();
var playerName 		 = "";

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render(__dirname + '/public/views/login');
});
app.post('/', urlencodedParser, (req, res) => {
	playerName = req.body.username;
	console.log(playerName);
	res.render(__dirname + '/public/views/home');
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
		name: playerName,
		id: socket.id,
		xPos: 0,
		yPos: 0,
		team: randomTeam,
		color: (randomTeam == "left") ? gameCfg.leftColor : gameCfg.rightColor
	};
	players.push(player);
	console.log(players);
	socket.on('action', (data) => {
		gameCfg.moveInbound(data, players, player);
		io.sockets.emit('update', {players: players, ball: ball, status: gameCfg});
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
		io.sockets.emit('update', {players: players, ball: ball, status: gameCfg});
	}, 1000/60);

	socket.on('disconnect', () => {
		console.log(players.indexOf(socket.id));
		players.splice(players.indexOf(player.id), 1);
		//clearInterval(interval);
	  	console.log('User disconnected! '+socket.id);
	  	console.log(players);
	});
});
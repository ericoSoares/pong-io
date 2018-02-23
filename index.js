var express 		 = require('express');
var socket  		 = require('socket.io');
var bodyParser       = require('body-parser');
var ball    		 = require('./config/ball.js');
var gameCfg 		 = require('./config/gameConfig.js');
var canvasCfg 		 = require('./config/canvasConfig.js');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Creates the express app
var app = express();

//Used to store players settings that are received from the login page
var playerSettings;

//EJS setupt
app.use(express.static('public'));
app.set('view engine', 'ejs');

//Renders login page
app.get('/', (req, res) => {
	res.render(__dirname + '/public/views/login');
});

//Gets the user settings after login and renders the game page
app.post('/', urlencodedParser, (req, res) => {
	//Extracts player settings from the request
	playerSettings = req.body;
	//Render game
	res.render(__dirname + '/public/views/home', {theme: playerSettings, size: canvasCfg});
});

//Starts server
var server = app.listen(process.env.PORT || 3000, () => {
	console.log("Listening to port 3000");
});

//io connection
var io = socket(server);
//Connected players array
var players = [];
//Game interval (for ball movement)
var interval;

//On socket connection
io.sockets.on('connection', (socket) => {
	console.log('Made socket connection ' + socket.id);

	//Clears interval if it exists to guarantee that there will only be 1 interval running
	if(interval) clearInterval(interval);

	//Creates a new player
	var player = {
		name: playerSettings.username,
		id: socket.id,
		xPos: (playerSettings.team == "left") ? 300 : 900,
		yPos: canvasCfg.height/2,
		team: playerSettings.team,
		theme: playerSettings.theme,
		screenSize: playerSettings.screenSize,
		displayNames: playerSettings.displayNames,
		color: (playerSettings.team == "left") ? gameCfg.leftColor : gameCfg.rightColor
	};

	//Pushes the new player into the connected players array
	players.push(player);

	//Receives player input
	socket.on('action', (data) => {
		//Checks if player input is valid (is inside the canvas)
		gameCfg.moveInbound(data, players, player);
		//Emits the update to all the connected clients with their respective settings
		for(var i in players) {
			io.sockets.connected[players[i].id].emit('update', {players: players, ball: ball, status: gameCfg, sets: players[i]});
		}
	});

	//Set interval which will update the ball, check for score and check for game end
	interval = setInterval(() => {
		//Does all the logic mentioned above
		gameCfg.gameLogicUpdate(players);
		//Emits the update to all connected players
		for(var i in players) {
			io.sockets.connected[players[i].id].emit('update', {players: players, ball: ball, status: gameCfg, sets: players[i]});
		}
	}, 1000/60);

	//Handles user disconnection
	socket.on('disconnect', () => {
		let del;
		//Finds index of plays to be disconnected
		for(var i = 0; i < players.length; i++) {
			if(players[i].id == socket.id)
				del = i;
		}
		//console.log("Player of id" + del + " disconnected!");
		//Removes the player from the connected player array
		players.splice(del, 1);
	});
});
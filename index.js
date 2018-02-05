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

io.on('connection', (socket) => {
	console.log('Made socket connection' + socket.id);

	socket.on('action', (data) => {
		console.log(data);
		io.sockets.emit('action', data);
	});
});
var pCfg = require('./playerConfig.js');

ball = {
	xPos: 10,
	yPos: 10,
	xSpeed: 10,
	ySpeed: 7,
	radius: 10,
	color: "red",
	move: function() {
		ball.xPos += ball.xSpeed;
		ball.yPos += ball.ySpeed;
	},
	checkHit: function(players) {
		//Wall collision
		if(ball.xPos > 500-ball.radius || ball.xPos < 0+ball.radius) ball.xSpeed *= -1;
		if(ball.yPos > 500-ball.radius || ball.yPos < 0+ball.radius) ball.ySpeed *= -1;
		//Player Collision
		for(var i in players) {
			let p = players[i];
			let dx = p.xPos - ball.xPos;
			let dy = p.yPos - ball.yPos;
			let dist = Math.sqrt((dx * dx) + (dy * dy));
			if(dist < pCfg.radius + ball.radius) {
				ball.xSpeed *= -1;
				ball.ySpeed *= -1;
			}
		}
	}
}

module.exports = ball;
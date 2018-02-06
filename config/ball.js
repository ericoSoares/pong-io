var pCfg = require('./playerConfig.js');

ball = {
	xPos: 400,
	yPos: 400,
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
				var angle = Math.atan2(dy,dx)*180/Math.PI;
				//console.log(angle);
				if(angle <= 0 && angle >= -90) {
					//1 quad x negative and y positive
					ball.xSpeed *= (ball.xSpeed > 0)? -1:1;
					ball.ySpeed *= (ball.ySpeed > 0)? 1:-1;
				} else if(angle < -90 && angle >= -180) {
					//2 quad both positive
					ball.xSpeed *= (ball.xSpeed > 0)? 1:-1;
					ball.ySpeed *= (ball.ySpeed > 0)? 1:-1;
				} else if(angle > 0 && angle <= 90) {
					//4 quad both negative
					ball.xSpeed *= (ball.xSpeed > 0)? -1:1;
					ball.ySpeed *= (ball.ySpeed > 0)? -1:1;
				} else if(angle > 90 && angle <= 180) {
					//3 quad y negative and x positive
					ball.xSpeed *= (ball.xSpeed > 0)? 1:-1;
					ball.ySpeed *= (ball.ySpeed > 0)? -1:1;
				}
			}
		}
	}
}

module.exports = ball;
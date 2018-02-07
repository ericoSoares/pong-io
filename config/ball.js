var pCfg = require('./playerConfig.js');
var canvasCfg = require('./canvasConfig.js');

ball = {
	xPos: 400,
	yPos: 400,
	xSpeed: 10,
	ySpeed: 7,
	radius: 10,
	combo: 0,
	color: "black",
	move: function() {
		ball.xPos += ball.xSpeed;
		ball.yPos += ball.ySpeed;
	},
	checkHit: function(players) {
		//Wall collision
		if(ball.xPos > canvasCfg.width-ball.radius || ball.xPos < 0+ball.radius) ball.xSpeed *= -1;
		if(ball.yPos > canvasCfg.height-ball.radius || ball.yPos < 0+ball.radius) ball.ySpeed *= -1;
		//Player Collision
		for(var i in players) {
			let p = players[i];
			let dx = p.xPos - ball.xPos;
			let dy = p.yPos - ball.yPos;
			let dist = Math.sqrt((dx * dx) + (dy * dy));
			if(dist < pCfg.radius + ball.radius) {
				if(ball.combo < 20) {
					ball.combo++;
					ball.xSpeed += 1;
					ball.ySpeed += 1;
				}
				var angle = Math.atan2(dy,dx)*180/Math.PI;
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
	},
	checkScore: function() {
		if(ball.xPos + ball.radius >= canvasCfg.width) 
			return "left";
		else if(ball.xPos - ball.radius <= 0)
			return "right";
		return "";
	},
	resetBall: function() {
		ball.xPos = canvasCfg.width/2;
		ball.yPos = canvasCfg.height/2;
		ball.xSpeed = Math.random() * (10 - 5) + 5;
		ball.ySpeed = Math.random() * (10 - 5) + 5;
		ball.xSpeed *= (Math.random() >= 0.5) ? -1:1;
		ball.ySpeed *= (Math.random() >= 0.5) ? -1:1;
	}
}

module.exports = ball;
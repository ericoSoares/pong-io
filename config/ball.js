ball = {
	xPos: 10,
	yPos: 10,
	xSpeed: 4,
	ySpeed: 3,
	radius: 10,
	color: "red",
	move: function() {
		ball.xPos += ball.xSpeed;
		ball.yPos += ball.ySpeed;
	},
	checkHit: function(players) {
		if(ball.xPos > 500 || ball.xPos < 0) ball.xSpeed *= -1;
		if(ball.yPos > 500 || ball.yPos < 0) ball.ySpeed *= -1;
	}
}

module.exports = ball;
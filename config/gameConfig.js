var canvasCfg = require('./canvasConfig.js');

var gameConfig = {
	leftQnt: 0,
	rightQnt: 0,
	leftScore: 0,
	rightScore: 0,
	leftColor: "#01bcd1",
	rightColor: "#08d102",
	resetScore: function() {
		gameConfig.leftScore = 0;
		gameConfig.rightScore = 0;
	},
	checkEndMatch: function() {
		return (gameConfig.leftScore >= 30 || gameConfig.rightScore >= 30);
	},
	moveInbound: function(data, players, player) {
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
	}
};

module.exports = gameConfig;
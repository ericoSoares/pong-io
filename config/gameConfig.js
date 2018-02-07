var gameConfig = {
	leftQnt: 0,
	rightQnt: 0,
	leftScore: 0,
	rightScore: 0,
	leftColor: "orange",
	rightColor: "purple",
	resetScore: function() {
		gameConfig.leftScore = 0;
		gameConfig.rightScore = 0;
	},
	checkEndMatch: function() {
		return (gameConfig.leftScore >= 30 || gameConfig.rightScore >= 30);
	}
};

module.exports = gameConfig;
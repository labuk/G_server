// Definición del modelo Player

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Player',
		{ pla_rate:  {
			type: DataTypes.INTEGER
		  },
		  pla_goal: {
			type: DataTypes.INTEGER
		  }
		});
}

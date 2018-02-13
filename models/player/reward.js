// Definición del modelo Player

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Reward',
		{ rew_points:  {
			type: DataTypes.INTEGER
		  }
		});
}

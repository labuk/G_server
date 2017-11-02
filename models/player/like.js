// Definición del modelo Gymko

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Like',
		{ lik_like:  {
			type: DataTypes.INTEGER
		  }
		});
}

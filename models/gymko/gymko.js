// Definición del modelo Gymko

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Gymko',
		{ gym_description:  {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Descripción"}}
		  },
		  gym_topic: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Temática"}}
		  },
		  gym_follow: {
			type: DataTypes.INTEGER
		  }
		});
}

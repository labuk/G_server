// Definición del modelo Gymko

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Prize',
		{ pri_description:  {
			type: DataTypes.TEXT,
			validate: {notEmpty: {msg: "-> Falta Descripción"}}
		  },
		  pri_type: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Temática"}}
		  },
			pri_points:  {
				allowNull: false,
				type: DataTypes.INTEGER
			},
		  pri_follow: {
			type: DataTypes.INTEGER
		  },
			pri_url:  {
				type: DataTypes.STRING
			}
		});
}

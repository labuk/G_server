// Definición del modelo Gymko

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Gymko',
		{ gym_description:  {
			type: DataTypes.TEXT,
			validate: {notEmpty: {msg: "-> Falta Descripción"}}
		  },
		  gym_topic: {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta Temática"}}
			}, // 0-Viajes  1-Gastro  2-Ocio  3-Agenda  4-Freak  5-Reto  6-Deportes  7-Descuento  8-Regalo  9-Sorteo
		  gym_follow: {
			type: DataTypes.INTEGER
		  },
			gym_type: {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Temática"}}
			}, // 1-Gymkos  2-Question  3-Agenda  4-Prize
			gym_point:  {
				allowNull: true,
				type: DataTypes.INTEGER
			},
			gym_url:  {
				type: DataTypes.STRING
			}
		});
}

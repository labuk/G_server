// Definición del modelo Gymko

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Koto',
		{ kot_description:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta Descripción"}}
			},
			kot_url:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta Descripción"}}
			}
		});
}

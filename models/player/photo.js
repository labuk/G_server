// Definición del modelo Gymko

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Photo',
		{ pho_likes:  {
				type: DataTypes.INTEGER
			},
			pho_url:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta Descripción"}}
			}
		});
}

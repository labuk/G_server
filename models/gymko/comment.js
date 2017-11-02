// Definición del modelo Quiz

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Comment',
		{ com_text:  {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Comentario"}}
		  }
		});
}

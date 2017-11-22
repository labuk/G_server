// Definición del modelo Quiz

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Note',
		{ not_text:  {
			type: DataTypes.TEXT,
			validate: {notEmpty: {msg: "-> Falta Comentario"}}
		  }
		});
}

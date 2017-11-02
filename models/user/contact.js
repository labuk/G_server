// Definición del modelo User
'use strict';
module.exports = function(sequelize, DataTypes){
	return sequelize.define('Contact',
		{ con_yoId:  {
			type: DataTypes.INTEGER,
			unique: true,
			validate: {notEmpty: {msg: "-> Falta yoId"}}
		  },
		  con_block: { // 0- Seguido, 1- Seguido, 2- Amigo, 3- Block
			type: DataTypes.INTEGER,
			validate: {notEmpty: {msg: "-> Falta Block"}}
			}
		},{
	    classMethods: {
	      associate: function(models) {
	        // associations can be defined here
	      }
	    }
	  });
}

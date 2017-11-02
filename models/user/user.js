// Definición del modelo User
'use strict';
module.exports = function(sequelize, DataTypes){
	return sequelize.define('User',
		{ usr_name:  {
			type: DataTypes.STRING,
			unique: true,
			validate: {notEmpty: {msg: "-> Falta Nombre"}}
		  },
		  usr_pass: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Contraseña"}}
			},
			usr_avatar: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Avatar"}}
			},
      usr_online:  {
  		type: DataTypes.BOOLEAN
      },
      usr_salt:  {
  		type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Sal"}}
      }
		},{
	    classMethods: {
	      associate: function(models) {
	        // associations can be defined here
	      }
	    }
	  });
}
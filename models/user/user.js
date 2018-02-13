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
			type: DataTypes.STRING(1030),
			validate: {notEmpty: {msg: "-> Falta Contraseña"}}
			},
			usr_avatar: {
			type: DataTypes.STRING
			},
			usr_status: {
			type: DataTypes.INTEGER
			},
			usr_points: {
				type: DataTypes.INTEGER
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

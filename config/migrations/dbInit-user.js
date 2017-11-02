'use strict';
module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      usr_name:  {
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
      usr_salt: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0
      }
    });
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.dropTable('Users');
  }
};

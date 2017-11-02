'use strict';
module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Contacts', {
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
      con_yoId:  {
        type: DataTypes.STRING,
        unique: true,
        validate: {notEmpty: {msg: "-> Falta Nombre"}}
      },
      con_block: {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "-> Falta Contraseña"}}
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    });
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.dropTable('Contacts');
  }
};

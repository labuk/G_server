'use strict';
module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Notes', {
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
      not_text:  {
        allowNull: false,
  			type: DataTypes.TEXT,
  			validate: {notEmpty: {msg: "-> Falta comentario"}}
  	  },
      GymkoId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    });
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.dropTable('Notes');
  }
};

'use strict';
module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Gymkos', {
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
      gym_description:  {
        allowNull: false,
  			type: DataTypes.TEXT,
  			validate: {notEmpty: {msg: "-> Falta Descripción"}}
  	  },
  		gym_topic: {
        allowNull: false,
  			type: DataTypes.STRING,
  			validate: {notEmpty: {msg: "-> Falta Temática"}}
  		},
      gym_follow: {
        type: DataTypes.INTEGER
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    });
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.dropTable('Gymkos');
  }
};

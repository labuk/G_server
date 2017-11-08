'use strict';
module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Kotos', {
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
      kot_description:  {
        allowNull: false,
  			type: DataTypes.STRING,
  			validate: {notEmpty: {msg: "-> Falta Descripción"}}
  	  },
      kot_url:  {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "-> Falta Descripción"}}
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
    return queryInterface.dropTable('Kotos');
  }
};

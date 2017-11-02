'use strict';
module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Photos', {
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
      pho_likes:  {
  			type: DataTypes.INTEGER
  	  },
      pho_url:  {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "-> Falta Descripción"}}
      },
      PlayerId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      KotoId: {
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
    return queryInterface.dropTable('Photos');
  }
};

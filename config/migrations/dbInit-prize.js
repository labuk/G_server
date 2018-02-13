'use strict';
module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Prizes', {
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
      pri_description:  {
        allowNull: false,
        type: DataTypes.TEXT
      },
      pri_type: {
        allowNull: false,
        type: DataTypes.STRING
      },
      pri_follow: {
        type: DataTypes.INTEGER
      },
      pri_points:  {
        allowNull: false,
  			type: DataTypes.INTEGER
  	  },
      pri_url:{
        allowNull: true,
        type: DataTypes.TEXT
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    });
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.dropTable('Prizes');
  }
};

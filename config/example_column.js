'use strict';
module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.addColumn('Gymkos', 'gym_url', {
        allowNull: true,
  			type: DataTypes.TEXT
  	});
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.removeColumn('Gymkos','gym_url');
  }
};

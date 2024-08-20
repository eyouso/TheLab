'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Goals', 'targetDate', {
      type: Sequelize.DATE,
      allowNull: true, // Make the column nullable
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Goals', 'targetDate', {
      type: Sequelize.DATE,
      allowNull: false, // Rollback to not nullable
    });
  }
};

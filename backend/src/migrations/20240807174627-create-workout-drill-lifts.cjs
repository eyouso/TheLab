'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WorkoutDrillLifts', {
      workoutId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Workouts',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      drillLiftId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'DrillLifts',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WorkoutDrillLifts');
  }
};

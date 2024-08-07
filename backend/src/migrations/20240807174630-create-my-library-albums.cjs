'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MyLibraryAlbums', {
      myLibraryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'MyLibraries',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      albumId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Albums',
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
    await queryInterface.dropTable('MyLibraryAlbums');
  }
};

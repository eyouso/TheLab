'use strict';
import { Model } from 'sequelize';

const Album = (sequelize, DataTypes) => {
  class Album extends Model {
    static associate(models) {
      Album.belongsToMany(models.MyLibrary, { through: 'MyLibraryAlbums' });
      Album.belongsToMany(models.TeamLibrary, { through: 'TeamLibraryAlbums' });
      Album.belongsToMany(models.CommunityLibrary, { through: 'CommunityLibraryAlbums' });
    }
  }
  Album.init({
    title: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Album',
  });
  return Album;
};

export default Album;

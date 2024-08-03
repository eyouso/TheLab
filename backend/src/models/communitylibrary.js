'use strict';
import { Model } from 'sequelize';

const CommunityLibrary = (sequelize, DataTypes) => {
  class CommunityLibrary extends Model {
    static associate(models) {
      CommunityLibrary.belongsToMany(models.Album, { through: 'CommunityLibraryAlbums' });
    }
  }
  CommunityLibrary.init({}, {
    sequelize,
    modelName: 'CommunityLibrary',
  });
  return CommunityLibrary;
};

export default CommunityLibrary;

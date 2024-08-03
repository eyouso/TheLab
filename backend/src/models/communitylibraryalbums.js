'use strict';
import { Model } from 'sequelize';

const CommunityLibraryAlbums = (sequelize, DataTypes) => {
  class CommunityLibraryAlbums extends Model {}
  CommunityLibraryAlbums.init({
    communityLibraryId: DataTypes.INTEGER,
    albumId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CommunityLibraryAlbums',
  });
  return CommunityLibraryAlbums;
};

export default CommunityLibraryAlbums;

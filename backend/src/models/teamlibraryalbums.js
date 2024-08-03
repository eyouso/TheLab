'use strict';
import { Model } from 'sequelize';

const TeamLibraryAlbums = (sequelize, DataTypes) => {
  class TeamLibraryAlbums extends Model {}
  TeamLibraryAlbums.init({
    teamLibraryId: DataTypes.INTEGER,
    albumId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'TeamLibraryAlbums',
  });
  return TeamLibraryAlbums;
};

export default TeamLibraryAlbums;

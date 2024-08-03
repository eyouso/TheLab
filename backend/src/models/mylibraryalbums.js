'use strict';
import { Model } from 'sequelize';

const MyLibraryAlbums = (sequelize, DataTypes) => {
  class MyLibraryAlbums extends Model {}
  MyLibraryAlbums.init({
    myLibraryId: DataTypes.INTEGER,
    albumId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'MyLibraryAlbums',
  });
  return MyLibraryAlbums;
};

export default MyLibraryAlbums;

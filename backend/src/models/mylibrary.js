'use strict';
import { Model } from 'sequelize';

const MyLibrary = (sequelize, DataTypes) => {
  class MyLibrary extends Model {
    static associate(models) {
      MyLibrary.belongsTo(models.User, { foreignKey: 'userId' });
      MyLibrary.belongsToMany(models.Album, { through: 'MyLibraryAlbums' });
    }
  }
  MyLibrary.init({
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'MyLibrary',
  });
  return MyLibrary;
};

export default MyLibrary;

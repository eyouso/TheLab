'use strict';
import { Model } from 'sequelize';

const User = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: 'userId' });
      User.belongsToMany(models.Team, { through: 'TeamMembers' });
      User.hasMany(models.Workout, { foreignKey: 'createdBy' });
      User.hasMany(models.Goal, { foreignKey: 'userId' });
      User.hasMany(models.Session, { foreignKey: 'userId' });
      User.belongsToMany(models.Album, { through: 'MyLibraryAlbums' });
      User.belongsToMany(models.Album, { through: 'CommunityLibraryAlbums' });
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.ENUM('coach', 'trainer', 'player', 'athletic_director'),
    hasCoachPermissions: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

export default User;

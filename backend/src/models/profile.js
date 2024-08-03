'use strict';
import { Model } from 'sequelize';

const Profile = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Profile.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    class: DataTypes.STRING,
    team: DataTypes.STRING,
    position: DataTypes.STRING,
    heightFeet: DataTypes.INTEGER,
    heightInches: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};

export default Profile;

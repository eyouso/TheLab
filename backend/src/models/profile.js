'use strict';
import { Model } from 'sequelize';

console.log('Defining Profile model'); // Debugging line

const Profile = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      // define association here
    }
  }
  Profile.init({
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
  console.log('Profile model defined'); // Debugging line
  return Profile;
};

export default Profile;

'use strict';

const profile = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    class: {
      type: DataTypes.STRING
    },
    team: {
      type: DataTypes.STRING
    },
    position: {
      type: DataTypes.STRING
    },
    heightFeet: {
      type: DataTypes.INTEGER
    },
    heightInches: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  Profile.associate = models => {
    Profile.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return Profile;
};

export default profile;

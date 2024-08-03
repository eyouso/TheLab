'use strict';
import { Model } from 'sequelize';

const Team = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      Team.belongsToMany(models.User, { through: 'TeamMembers' });
      Team.hasMany(models.TeamLibrary, { foreignKey: 'teamId' });
    }
  }
  Team.init({
    name: DataTypes.STRING,
    coachId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};

export default Team;

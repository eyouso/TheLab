'use strict';
import { Model } from 'sequelize';

const TeamMember = (sequelize, DataTypes) => {
  class TeamMember extends Model {}
  TeamMember.init({
    teamId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'TeamMember',
  });
  return TeamMember;
};

export default TeamMember;

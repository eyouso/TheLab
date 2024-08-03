'use strict';
import { Model } from 'sequelize';

const TeamLibrary = (sequelize, DataTypes) => {
  class TeamLibrary extends Model {
    static associate(models) {
      TeamLibrary.belongsTo(models.Team, { foreignKey: 'teamId' });
      TeamLibrary.belongsToMany(models.Album, { through: 'TeamLibraryAlbums' });
    }
  }
  TeamLibrary.init({
    teamId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'TeamLibrary',
  });
  return TeamLibrary;
};

export default TeamLibrary;

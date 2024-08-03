'use strict';
import { Model } from 'sequelize';

const Session = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      Session.belongsTo(models.Workout, { foreignKey: 'workoutId' });
      Session.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Session.init({
    workoutId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    duration: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};

export default Session;

'use strict';
import { Model } from 'sequelize';

const DrillLift = (sequelize, DataTypes) => {
  class DrillLift extends Model {
    static associate(models) {
      DrillLift.belongsToMany(models.Workout, { through: 'WorkoutDrillLifts' });
    }
  }
  DrillLift.init({
    title: DataTypes.STRING,
    sets: DataTypes.INTEGER,
    reps: DataTypes.INTEGER,
    description: DataTypes.STRING,
    notes: DataTypes.STRING,
    videoURL: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'DrillLift',
  });
  return DrillLift;
};

export default DrillLift;

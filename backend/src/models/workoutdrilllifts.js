'use strict';
import { Model } from 'sequelize';

const WorkoutDrillLifts = (sequelize, DataTypes) => {
  class WorkoutDrillLifts extends Model {}
  WorkoutDrillLifts.init({
    workoutId: DataTypes.INTEGER,
    drillLiftId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'WorkoutDrillLifts',
  });
  return WorkoutDrillLifts;
};

export default WorkoutDrillLifts;

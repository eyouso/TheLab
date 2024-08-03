'use strict';
import { Model } from 'sequelize';

const Workout = (sequelize, DataTypes) => {
  class Workout extends Model {
    static associate(models) {
      Workout.belongsTo(models.User, { foreignKey: 'createdBy' });
      Workout.hasMany(models.Session, { foreignKey: 'workoutId' });
      Workout.belongsToMany(models.DrillLift, { through: 'WorkoutDrillLifts' });
      Workout.hasMany(models.Album, { foreignKey: 'workoutId' });
    }
  }
  Workout.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Workout',
  });
  return Workout;
};

export default Workout;

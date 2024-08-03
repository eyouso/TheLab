'use strict';
import { Model } from 'sequelize';

const Goal = (sequelize, DataTypes) => {
  class Goal extends Model {
    static associate(models) {
      Goal.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Goal.init({
    title: DataTypes.STRING,
    targetDate: DataTypes.DATE,
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Goal',
  });
  return Goal;
};

export default Goal;

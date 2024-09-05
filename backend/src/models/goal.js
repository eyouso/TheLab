'use strict';
import { Model } from 'sequelize';

const Goal = (sequelize, DataTypes) => {
  class Goal extends Model {
    static associate(models) {
      Goal.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Goal.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // This is Sequelize's default UUID generation, remove it if generating on the client side
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    goal: {
      type: DataTypes.ENUM('teamGoal', 'individualGoal'),
      allowNull: false,
    },
    createdby: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Goal',
    timestamps: true,
  });  
  return Goal;
};

export default Goal;

import { db } from '../models/index.js';

const { Goal } = db;

export const getGoalsByUserId = async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: { userId: req.params.userId },
      attributes: ['id', 'title', 'goal', 'targetDate', 'createdAt', 'updatedAt', 'userId', 'createdby']
    });
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

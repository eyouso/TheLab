import { db } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';  // Import the uuid function

const { Goal } = db;

// Fetch goals by user ID
export const getGoalsByUserId = async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: { userId: req.params.userId },
      attributes: ['id', 'title', 'goal', 'targetDate', 'createdAt', 'updatedAt', 'userId', 'createdby']
    });
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'An error occurred while fetching goals' });
  }
};

// Add a new goal for a user
export const addGoal = async (req, res) => {
  const { id, title, goal, targetDate, createdby, userId } = req.body; // Get UUID from request body
  try {
    const newGoal = await Goal.create({
      id,  // Use the UUID sent from the client
      title,
      goal,
      targetDate: targetDate || null,  // Allow null for targetDate
      createdby,
      userId: userId || req.params.userId // Fallback to req.params.userId if userId isn't in the body
    });
    res.status(201).json(newGoal);
  } catch (error) {
    console.error('Error adding goal:', error);
    res.status(500).json({ error: 'An error occurred while adding the goal' });
  }
};


// Update a goal for a user
export const updateGoal = async (req, res) => {
  try {
    const { userId } = req.params;
    const goalId = req.params.goalId;

    // Ensure userId is not undefined
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const goal = await Goal.findOne({ where: { id: goalId, userId: userId } });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const { title, goal: goalType, targetDate } = req.body;
    goal.title = title;
    goal.goal = goalType;
    goal.targetDate = targetDate;

    await goal.save();
    res.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'An error occurred while updating the goal' });
  }
};


// Delete a goal for a user
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ where: { id: req.params.goalId, userId: req.params.userId } });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await goal.destroy();
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'An error occurred while deleting the goal' });
  }
};

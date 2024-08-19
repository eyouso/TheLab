import express from 'express';
import { getGoalsByUserId, addGoal, updateGoal, deleteGoal } from '../controllers/goalController.js';

const router = express.Router();

// Routes for goals
router.get('/users/:userId/goals', getGoalsByUserId);
router.post('/users/:userId/goals', addGoal);
router.put('/users/:userId/goals/:goalId', updateGoal);
router.delete('/users/:userId/goals/:goalId', deleteGoal);

export default router;

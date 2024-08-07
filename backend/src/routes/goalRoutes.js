import express from 'express';
import { getGoalsByUserId } from '../controllers/goalController.js';

const router = express.Router();

router.get('/users/:userId/goals', getGoalsByUserId);

// Other routes...

export default router;

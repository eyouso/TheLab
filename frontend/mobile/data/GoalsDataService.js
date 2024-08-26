// GoalsDataService.js
import { API_URL } from './dataService'; // Reuse the API_URL from dataService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const userId = 2; // Hardcoded for now, you might want to make this dynamic

export const fetchGoalsByUserId = async () => {
  const url = `${API_URL}/users/${userId}/goals`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch goals: ${response.statusText}`);
    }
    const goals = await response.json();
    await saveGoalsToLocal(goals); // Save the fetched goals to AsyncStorage
    return goals;
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
};

export const addGoalToServer = async (goal) => {
    const url = `${API_URL}/users/${goal.userId}/goals`;
  
    // Map fields correctly to match the backend's expected structure
    const goalData = {
      title: goal.goalTitle, // Map `goalTitle` to `title`
      createdby: goal.creator, // Map `creator` to `createdby`
      targetDate: goal.targetDate || null, // Handle nullable `targetDate`
      goal: goal.goal, // Keep other fields as they are
      createdAt: goal.createdAt,
      userId: goal.userId, // Ensure userId is sent properly
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData), // Send the correctly structured goalData
      });
      if (!response.ok) {
        throw new Error(`Failed to add goal: ${response.statusText}`);
      }
      const addedGoal = await response.json();
      return addedGoal;
    } catch (error) {
      console.error('Failed to add goal:', error);
      throw error;
    }
  };
  

  export const updateGoalOnServer = async (goal) => {
    const url = `${API_URL}/users/${goal.userId}/goals/${goal.id}`;
  
    // Ensure the title field is properly set
    if (!goal.title) {
      console.error("Title is missing in the goal object before update:", goal);
      throw new Error("Goal.title cannot be null");
    }
  
    const goalData = {
      title: goal.title, // Already mapped in handleSaveGoal
      createdby: goal.createdby || goal.creator, // Ensure createdby is properly set
      targetDate: goal.targetDate || null, // Handle nullable `targetDate`
      goal: goal.goal, // Keep other fields as they are
      createdAt: goal.createdAt,
      userId: goal.userId,
    };
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update goal: ${response.statusText}`);
      }
  
      const updatedGoal = await response.json();
      return updatedGoal;
    } catch (error) {
      console.error('Failed to update goal:', error);
      throw error;
    }
  };
  
  

export const deleteGoalFromServer = async (goalId) => {
  const url = `${API_URL}/users/${userId}/goals/${goalId}`;
  try {
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`Failed to delete goal: ${response.statusText}`);
    }
    return true;
  } catch (error) {
    console.error('Failed to delete goal:', error);
    throw error;
  }
};

export const saveGoalsToLocal = async (goals) => {
  try {
    await AsyncStorage.setItem('goals', JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save goals to local storage:', error);
  }
};

export const loadGoalsFromLocal = async () => {
  try {
    const storedGoals = await AsyncStorage.getItem('goals');
    return storedGoals ? JSON.parse(storedGoals) : [];
  } catch (error) {
    console.error('Failed to load goals from local storage:', error);
    return [];
  }
};

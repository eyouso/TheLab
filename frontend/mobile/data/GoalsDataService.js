import { API_URL } from './dataService'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const userId = 2; 

export const fetchGoalsByUserId = async () => {
  const url = `${API_URL}/users/${userId}/goals`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch goals: ${response.statusText}`);
    }
    const goals = await response.json();
    await saveGoalsToLocal(goals); 
    return goals;
  } catch (error) {
    console.log('Error fetching goals:', error);
    throw error; // Propagate the error so the caller knows it failed
  }
};

export const addGoalToServer = async (goal) => {
  const url = `${API_URL}/users/${goal.userId}/goals`;

  const goalData = {
    title: goal.goalTitle, 
    createdby: goal.creator, 
    targetDate: goal.targetDate || null, 
    goal: goal.goal, 
    createdAt: goal.createdAt,
    userId: goal.userId, 
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData), 
    });
    if (!response.ok) {
      throw new Error(`Failed to add goal: ${response.statusText}`);
    }
    const addedGoal = await response.json();
    return addedGoal;
  } catch (error) {
    console.log('Failed to add goal:', error);
    throw error;
  }
};

export const updateGoalOnServer = async (goal) => {
  const url = `${API_URL}/users/${goal.userId}/goals/${goal.id}`;

  if (!goal.title) {
    console.log("Title is missing in the goal object before update:", goal);
    throw new Error("Goal.title cannot be null");
  }

  const goalData = {
    title: goal.title, 
    createdby: goal.createdby || goal.creator, 
    targetDate: goal.targetDate || null, 
    goal: goal.goal, 
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
    console.log('Failed to update goal:', error);
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
    console.log('Failed to delete goal:', error);
    throw error;
  }
};

export const saveGoalsToLocal = async (goals) => {
  try {
    await AsyncStorage.setItem('goals', JSON.stringify(goals));
  } catch (error) {
    console.log('Failed to save goals to local storage:', error);
  }
};

export const loadGoalsFromLocal = async () => {
  try {
    const storedGoals = await AsyncStorage.getItem('goals');
    return storedGoals ? JSON.parse(storedGoals) : [];
  } catch (error) {
    console.log('Failed to load goals from local storage:', error);
    return [];
  }
};

export const loadGoalsAndHandleErrors = async () => {
  const localGoals = await loadGoalsFromLocal(); // Load local goals first
  let serverGoals = [];

  try {
    serverGoals = await fetchGoalsByUserId();  // Attempt to fetch from server
  } catch (error) {
    console.log('Error fetching goals from server, using local goals:', error);
    serverGoals = localGoals;  // Fall back to local goals if server fetch fails
  }

  return serverGoals.length > 0 ? serverGoals : localGoals;  // Return whichever set of goals is available
};

export const addGoal = async (goal) => {
  const localGoals = await loadGoalsFromLocal();
  const newGoal = { ...goal, id: `local-${Date.now()}`, isPendingSync: true };
  localGoals.push(newGoal);
  await saveGoalsToLocal(localGoals);

  return newGoal;

  // Attempt to sync with the server in the background
  try {
    const addedGoal = await addGoalToServer(newGoal);
    const updatedGoals = localGoals.map(g => g.id === newGoal.id ? { ...addedGoal, isPendingSync: false } : g);
    await saveGoalsToLocal(updatedGoals);
  } catch (error) {
    console.log("Failed to sync new goal to the server:", error);
  }
};

export const updateGoal = async (goal) => {
  const localGoals = await loadGoalsFromLocal();
  const updatedGoals = localGoals.map(g => g.id === goal.id ? { ...goal, isPendingSync: true } : g);
  await saveGoalsToLocal(updatedGoals);

  try {
    const syncedGoal = await updateGoalOnServer(goal);
    const syncedGoals = updatedGoals.map(g => g.id === syncedGoal.id ? { ...syncedGoal, isPendingSync: false } : g);
    await saveGoalsToLocal(syncedGoals);
    return syncedGoal;
  } catch (error) {
    console.log("Failed to sync updated goal to the server:", error);
    return goal;
  }
};

export const deleteGoal = async (goalId) => {
    // Load the local goals and immediately update the state/UI
    const localGoals = await loadGoalsFromLocal();
    const updatedGoals = localGoals.filter(g => g.id !== goalId);
    await saveGoalsToLocal(updatedGoals);
  
    // Return the updated goals immediately to update the UI
    return updatedGoals;
  
    // Perform the network request in the background
    try {
      await deleteGoalFromServer(goalId);
    } catch (error) {
      console.log('Failed to delete goal from server:', error);
      // Handle failed deletion sync here if necessary (e.g., mark as pending deletion)
    }
  };
  

export const retryPendingSyncs = async (retryCount = 0) => {
  const MAX_RETRIES = 5;
  const BACKOFF_DELAY = 60000; // 1 minute

  if (retryCount >= MAX_RETRIES) {
    console.log(`Max retry attempts reached: ${retryCount}`);
    return;
  }

  const localGoals = await loadGoalsFromLocal();
  const pendingGoals = localGoals.filter(goal => goal.isPendingSync);

  for (const goal of pendingGoals) {
    try {
      if (goal.id.startsWith("local-")) {
        const addedGoal = await addGoalToServer(goal);
        goal.id = addedGoal.id;
        goal.isPendingSync = false;
      } else if (goal.isPendingUpdate) {
        await updateGoalOnServer(goal);
        goal.isPendingSync = false;
      } else if (goal.isPendingDelete) {
        await deleteGoalFromServer(goal.id);
        goal.isPendingSync = false;
      }
    } catch (error) {
      console.log('Failed to retry sync:', error);
      setTimeout(() => retryPendingSyncs(retryCount + 1), BACKOFF_DELAY * (retryCount + 1));
      return;
    }
  }

  await saveGoalsToLocal(localGoals);
};

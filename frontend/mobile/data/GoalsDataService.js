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
    return await response.json();
  } catch (error) {
    console.log('Error fetching goals:', error);
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

export const syncGoalsToLocalStorage = async () => {
  try {
    const localGoals = await loadGoalsFromLocal();
    let serverGoals = [];

    try {
      serverGoals = await fetchGoalsByUserId(); // Fetch from the server
    } catch (error) {
      console.log("Error fetching goals from server:", error);
      return; // Return if server fetch fails
    }

    // Merge local goals with server goals, but exclude any goal marked for deletion
    const localGoalsMap = new Map(localGoals.map(goal => [goal.id, goal]));
    const mergedGoals = serverGoals.map(serverGoal => {
      if (localGoalsMap.has(serverGoal.id)) {
        const localGoal = localGoalsMap.get(serverGoal.id);

        // If the local goal is marked for deletion, ignore the server version
        if (localGoal.isPendingDelete) {
          return null;
        }

        // Otherwise, merge the server goal with the local goal
        return { ...localGoal, ...serverGoal, isPendingSync: false };
      }
      return serverGoal;
    }).filter(goal => goal !== null); // Filter out null (goals that are pending deletion)

    // Add any local goals not in the server goals
    localGoals.forEach(localGoal => {
      if (!mergedGoals.find(goal => goal.id === localGoal.id)) {
        mergedGoals.push(localGoal);
      }
    });

    await saveGoalsToLocal(mergedGoals); // Save the merged goals
    return mergedGoals;
  } catch (error) {
    console.log("Failed to sync goals to local storage:", error);
    throw error;
  }
};

export const syncGoalsToServer = async () => {
  console.log("Syncing goals to server...");

  // Step 1: Load local goals
  const localGoals = await loadGoalsFromLocal();

  // Step 2: Sync deletions for goals marked with isPendingDelete
  const pendingDeleteGoals = localGoals.filter(goal => goal.isPendingDelete && !goal.isPendingSync); // Only sync deletions for goals that were synced to the server
  for (const goal of pendingDeleteGoals) {
    try {
      // Attempt to delete from server
      await deleteGoalFromServer(goal.id);

      // After successful server deletion, remove the goal from local storage
      const updatedGoals = localGoals.filter(g => g.id !== goal.id);
      await saveGoalsToLocal(updatedGoals);

    } catch (error) {
      console.log(`Failed to delete goal ${goal.id} from server:`, error);
      // Keep the goal in local storage with isPendingDelete, so it's retried later
    }
  }

  // Step 3: Sync remaining goals that are pending sync or update
  const pendingSyncGoals = localGoals.filter(goal => goal.isPendingSync && !goal.isPendingDelete); // Exclude goals marked for deletion

  for (const goal of pendingSyncGoals) {
    try {
      let syncedGoal;

      // If the goal is new, add it to the server
      if (!goal.id || goal.isPendingSync) {
        syncedGoal = await addGoalToServer(goal);  // Add new goal to the server
      } else if (goal.isPendingUpdate) {
        // If the goal exists but has been updated, update it on the server
        syncedGoal = await updateGoalOnServer(goal); // Update existing goal on the server
      }

      // After successfully syncing, remove the `isPendingSync` flag
      goal.isPendingSync = false;

      // Update local goals list with the synced goal (whether added or updated)
      const updatedGoals = localGoals.map(g => g.id === goal.id ? { ...goal, ...syncedGoal } : g);
      await saveGoalsToLocal(updatedGoals); // Save the updated goals back to local storage

    } catch (error) {
      console.log("Failed to sync goal to server:", error);
    }
  }

  // Save the final updated list of goals after sync operations
  await saveGoalsToLocal(localGoals);

  return localGoals; // Return updated local goals after syncing
};



export const addGoalToServer = async (goal, signal) => {
  const url = `${API_URL}/users/${goal.userId}/goals`;

  const goalData = {
    id: goal.id, 
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
      signal,  // Pass the abort signal here
    });
    if (!response.ok) {
      throw new Error(`Failed to add goal: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Add goal request was aborted.');
    } else {
      console.log('Failed to add goal:', error);
    }
    throw error;
  }
};


export const updateGoalOnServer = async (goal, signal) => {
  const url = `${API_URL}/users/${goal.userId}/goals/${goal.id}`;  // Use goal ID to update

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
      method: 'PUT',  // Use PUT for updating existing goals
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to update goal: ${response.statusText}`);
    }

    return await response.json();
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

export const addGoalToLocal = async (goal) => {
  const localGoals = await loadGoalsFromLocal();
  const newGoal = { ...goal, isPendingSync: true }; // No need for local- prefix as UUID is already generated
  localGoals.push(newGoal);
  await saveGoalsToLocal(localGoals);

  // Return the new goal immediately to update the UI
  return newGoal;
};

  
export const syncGoalToServer = async (goal, updateGoalsInUI, abortController) => {
  try {
    const controller = abortController || new AbortController();
    const signal = controller.signal;

    let syncedGoal;

    if (!goal.isPendingSync) {
      // If the goal is not pending sync (it exists on the server), update it with PUT
      syncedGoal = await updateGoalOnServer(goal, signal);  // Use PUT request for update
    } else {
      // If the goal is pending sync, it's a new goal, use POST
      syncedGoal = await addGoalToServer(goal, signal);  // Use POST request for new goal
    }

    const localGoals = await loadGoalsFromLocal();

    // Update the goal with the server response and clear the isPendingSync flag
    const updatedGoals = localGoals.map(g => g.id === goal.id ? { ...syncedGoal, isPendingSync: false } : g);
    await saveGoalsToLocal(updatedGoals);

    if (updateGoalsInUI) {
      updateGoalsInUI(updatedGoals);
    }

    return syncedGoal; // Return the synced goal
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log("Sync request was aborted.");
    } else {
      console.log("Failed to sync goal to server:", error);
    }
    return goal; // Return the goal with the pending sync tag intact
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

export const updateGoalLocally = async (goal) => {
  const localGoals = await loadGoalsFromLocal();
  const updatedGoals = localGoals.map((g) => (g.id === goal.id ? { ...goal, isPendingSync: true } : g));
  await saveGoalsToLocal(updatedGoals);
};

export const deleteGoalFromLocal = async (goalId) => {
  const localGoals = await loadGoalsFromLocal();

  // Find the goal to check if it has the isPendingSync flag
  const goal = localGoals.find(g => g.id === goalId);
  
  // If the goal has isPendingSync, remove it immediately (because it was never synced to the server)
  if (goal && goal.isPendingSync) {
    const updatedGoals = localGoals.filter(g => g.id !== goalId); // Remove from local storage
    await saveGoalsToLocal(updatedGoals);
    console.log(`Goal ${goalId} removed from local storage because it was pending sync and deleted offline.`);
    return updatedGoals; // Return updated list
  }

  // Otherwise, mark the goal for deletion by setting isPendingDelete
  const updatedGoals = localGoals.map(goal =>
    goal.id === goalId ? { ...goal, isPendingDelete: true } : goal
  );
  
  await saveGoalsToLocal(updatedGoals); // Save updated goals with deletion mark
  return updatedGoals;
};


  
  export const syncDeleteGoalToServer = async (goalId, updateGoalsInUI) => {
    try {
      await deleteGoalFromServer(goalId);
      
      // After successful server deletion, remove the goal from local storage
      const localGoals = await loadGoalsFromLocal();
      const updatedGoals = localGoals.filter(g => g.id !== goalId);
      await saveGoalsToLocal(updatedGoals);
  
      // Update the UI immediately after deletion
      if (updateGoalsInUI) {
        updateGoalsInUI(updatedGoals);
      }
  
    } catch (error) {
      console.log('Failed to delete goal from server:', error);
      // If the delete failed, mark the goal for deletion on the next sync attempt
      const localGoals = await loadGoalsFromLocal();
      const updatedGoals = localGoals.map(g => g.id === goalId ? { ...g, isPendingDelete: true } : g);
      await saveGoalsToLocal(updatedGoals);
  
      if (updateGoalsInUI) {
        updateGoalsInUI(updatedGoals);
      }
    }
  };

  // Mark a goal for deletion from the server
  export const markGoalForDeletion = async (goalId) => {
    const localGoals = await loadGoalsFromLocal();
  
    // Mark the goal for deletion locally
    const updatedGoals = localGoals.map(goal => 
      goal.id === goalId ? { ...goal, isPendingDelete: true } : goal
    );
  
    await saveGoalsToLocal(updatedGoals); // Save the updated list with pending deletion flag
  };

  export const syncPendingDeletions = async () => {
    const localGoals = await loadGoalsFromLocal();
    const pendingDeleteGoals = localGoals.filter(goal => goal.isPendingDelete); // Filter goals marked for deletion
  
    for (const goal of pendingDeleteGoals) {
      try {
        // Attempt to delete from server
        await deleteGoalFromServer(goal.id);
  
        // After successful deletion from server, remove from local storage
        const updatedGoals = localGoals.filter(g => g.id !== goal.id);
        await saveGoalsToLocal(updatedGoals);
  
      } catch (error) {
        console.log(`Failed to delete goal ${goal.id} from server:`, error);
        // Optionally, implement retry logic or error handling here
      }
    }
  };

  export const clearAllGoalsFromLocal = async () => {
    try {
      await AsyncStorage.removeItem('goals'); // Remove all stored goals
      console.log("All goals cleared from local storage.");
    } catch (error) {
      console.log("Failed to clear goals from local storage:", error);
      throw error;
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

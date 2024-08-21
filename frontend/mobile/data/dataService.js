import dummyAlbums from './dummyAlbums.json';
import dummyActiveWorkouts from './dummyActiveWorkouts.json';

const generateId = () => {
  const id = Math.random().toString(36).substr(2, 9);
  console.log(`Generated ID: ${id}`);
  return id;
};

// Maintain a current state of goals, albums, and active workouts in memory
let currentGoals = [];
let currentAlbums = { ...dummyAlbums };
let currentActiveWorkouts = [...dummyActiveWorkouts.activeWorkouts];

//temporaty user id
const userId = 2;

const API_URL = 'http://192.168.0.76:3000/api'; // Adjust the URL as needed

export const fetchProfileData = async (profileId) => {
  try {
    const response = await fetch(`${API_URL}/profiles/${profileId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
  }
};

// Fetch goals from the backend
export const fetchGoalsByUserId = async () => {
  const url = `${API_URL}/users/${userId}/goals`;
  console.log('Fetching goals from URL:', url); // Debugging line
  try {
    const response = await fetch(url);
    console.log('Response status:', response.status); // Debugging line
    if (!response.ok) {
      throw new Error(`Failed to fetch goals: ${response.status} ${response.statusText}`);
    }
    const goals = await response.json();
    console.log('Fetched goals:', goals); // Debugging line
    
    // Update currentGoals with the fetched goals
    currentGoals = [...goals];
    saveGoalData(currentGoals); // Save the goals locally (to AsyncStorage, for example)
    
    return goals;
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
};

// Add a new goal to the backend
export const addGoalToServer = async (goal) => {
  const url = `${API_URL}/users/${userId}/goals`;

  // Ensure all required fields are set before sending to the server
  const goalData = {
    title: goal.goalTitle, // Map `goalTitle` to `title`
    createdby: goal.creator, // Ensure `createdby` is properly set
    targetDate: goal.targetDate || null, // Handle nullable `targetDate`
    goal: goal.goal, // Keep other fields as they are
    createdAt: goal.createdAt,
    userId: userId,
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
      throw new Error(`Failed to add goal: ${response.status} ${response.statusText}`);
    }
    const addedGoal = await response.json();
    console.log('Goal added to server:', addedGoal);
    return addedGoal;
  } catch (error) {
    console.error('Failed to add goal to server:', error);
    throw error;
  }
};

// Update a goal on the backend
export const updateGoalOnServer = async (goal) => {
  const url = `${API_URL}/users/${userId}/goals/${goal.id}`;
  console.log("Sending goal data to server for update:", goal); // Check goal data

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
    });

    if (!response.ok) {
      throw new Error(`Failed to update goal: ${response.status} ${response.statusText}`);
    }

    const updatedGoal = await response.json();
    console.log('Goal updated on server:', updatedGoal);
    return updatedGoal;
  } catch (error) {
    console.error('Failed to update goal on server:', error);
    throw error;
  }
};

// Delete a goal from the backend
export const deleteGoalFromServer = async (goalId) => {
  const url = `${API_URL}/users/${userId}/goals/${goalId}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete goal: ${response.status} ${response.statusText}`);
    }
    console.log('Goal successfully deleted from server:', goalId);
    return true;
  } catch (error) {
    console.error('Failed to delete goal from server:', error);
    throw error; // Ensure the error is thrown so it can be caught in the calling function
  }
};

// Save goals locally and sync with the server when needed
export const saveGoalData = (goals) => {
  console.log('Saving goals locally:', JSON.stringify(goals, null, 2));
  currentGoals = [...goals];
};

// Add a goal locally and sync with the server
export const addGoal = async (newGoal) => {
  newGoal.id = generateId();
  console.log('Adding new goal locally:', newGoal);

  currentGoals.push(newGoal);
  saveGoalData(currentGoals);

  try {
    const addedGoal = await addGoalToServer(newGoal); // Sync with server
    console.log('Goal successfully synced to server:', addedGoal);

    // Replace local goal with server response to ensure consistency
    currentGoals = currentGoals.map(goal => (goal.id === newGoal.id ? addedGoal : goal));
    saveGoalData(currentGoals);

    return addedGoal;
  } catch (error) {
    console.error('Failed to sync new goal to the server:', error);
    return newGoal;
  }
};

// Update a goal locally and sync with the server
export const updateGoal = async (updatedGoal) => {
  console.log('Looking for goal with id:', updatedGoal.id);

  const index = currentGoals.findIndex(goal => goal.id === updatedGoal.id);
  
  if (index !== -1) {
    currentGoals[index] = updatedGoal;
    saveGoalData(currentGoals); // Save the updated goals locally

    try {
      if (!updatedGoal.userId) {
        console.error("User ID is missing for the goal update");
        return null;
      }

      // Sync with the server
      const syncedGoal = await updateGoalOnServer(updatedGoal);
      console.log('Goal successfully synced to server:', syncedGoal);

      currentGoals[index] = syncedGoal; // Replace local goal with the synced one
      saveGoalData(currentGoals);

      return syncedGoal;
    } catch (error) {
      console.error('Failed to sync updated goal to the server:', error);
      return updatedGoal;
    }
  } else {
    console.error('Goal not found locally:', updatedGoal.id);
    console.log('Current goals:', JSON.stringify(currentGoals, null, 2)); // Log the current goals for debugging
    return null;
  }
};


// Delete a goal locally and sync with the server
export const deleteGoal = async (goalId, userId) => {
  currentGoals = currentGoals.filter(goal => goal.id !== goalId);
  saveGoalData(currentGoals);
  console.log('Goal deleted locally:', goalId);

  try {
    await deleteGoalFromServer(goalId, userId); // Sync with server
    console.log('Goal successfully deleted from server:', goalId);
  } catch (error) {
    console.error('Failed to delete goal from server:', error);
  }

  return currentGoals;
};


// Other functions for managing albums, active workouts, etc., remain unchanged.

export const fetchAlbums = () => {
  return currentAlbums;
};

export const addAlbum = (newAlbum) => {
  newAlbum.id = generateId();
  console.log('Adding new album:', newAlbum);
  currentAlbums.myLibraryAlbums.push(newAlbum);
  saveAlbums(currentAlbums);
  return newAlbum;
};

export const saveAlbums = (albums) => {
  console.log('Saving albums:', JSON.stringify(albums, null, 2));
  currentAlbums = { ...albums };
  // Here you would replace the console log with an API call to save the data
};

export const addWorkoutToAlbum = (albumId, workout, overwrite = false) => {
  const album = currentAlbums.myLibraryAlbums.find(a => a.id === albumId) || currentAlbums.teamLibraryAlbums.find(a => a.id === albumId) || currentAlbums.communityLibraryAlbums.find(a => a.id === albumId);

  if (!album) {
    console.error(`Album with ID ${albumId} not found`);
    return false;
  }

  if (!workout.id) {
    workout.id = generateId();  // Ensure workout has a unique id
  }

  const existingWorkoutIndex = album.contents.findIndex(w => w.title === workout.title);
  console.log('Existing workout index:', existingWorkoutIndex);

  if (existingWorkoutIndex !== -1) {
    if (overwrite) {
      album.contents[existingWorkoutIndex] = workout;
    } else {
      return false;
    }
  } else {
    album.contents.push(workout);
  }

  saveAlbums(currentAlbums);
  console.log('Workout added to album:', albumId);
  return true;
};

export const deleteAlbum = (albumId) => {
  const albumIndex = currentAlbums.myLibraryAlbums.findIndex(album => album.id === albumId);
  if (albumIndex !== -1) {
    currentAlbums.myLibraryAlbums.splice(albumIndex, 1);
    saveAlbums(currentAlbums);
    return true;
  }
  return false;
};

// Functions for managing active workouts
export const fetchActiveWorkouts = () => {
  return currentActiveWorkouts;
};

export const addActiveWorkout = (workout) => {
  workout.id = generateId();
  currentActiveWorkouts.push(workout);
  saveActiveWorkouts();
  return workout;
};

export const deleteActiveWorkout = (workoutId) => {
  currentActiveWorkouts = currentActiveWorkouts.filter(workout => workout.id !== workoutId);
  saveActiveWorkouts();
  return currentActiveWorkouts;
};

export const updateActiveWorkout = (updatedWorkout) => {
  const index = currentActiveWorkouts.findIndex(workout => workout.id === updatedWorkout.id);
  if (index !== -1) {
    currentActiveWorkouts[index] = updatedWorkout;
    saveActiveWorkouts();
  }
  return updatedWorkout;
};

export const updateDrillLiftInWorkout = (workoutId, drillLiftId, updatedDrillLift) => {
  const workoutIndex = currentActiveWorkouts.findIndex(workout => workout.id === workoutId);
  if (workoutIndex !== -1) {
    const workout = currentActiveWorkouts[workoutIndex];
    const drillLiftIndex = workout.drillLifts.findIndex(drillLift => drillLift.id === drillLiftId);
    if (drillLiftIndex !== -1) {
      workout.drillLifts[drillLiftIndex] = updatedDrillLift;
      updateActiveWorkout(workout);
    }
  }
};

export const saveActiveWorkouts = () => {
  console.log('Saving active workouts:', JSON.stringify(currentActiveWorkouts, null, 2));
  // Here you would replace the console log with an API call to save the data
};

export const removeDrillLiftFromWorkout = (workoutId, drillLiftId) => {
  const workoutIndex = currentActiveWorkouts.findIndex(workout => workout.id === workoutId);
  if (workoutIndex !== -1) {
    const workout = currentActiveWorkouts[workoutIndex];
    workout.drillLifts = workout.drillLifts.filter(drillLift => drillLift.id !== drillLiftId);
    updateActiveWorkout(workout);
  }
};

import dummyGoalData from './dummyGoalData.json';
import dummyAlbums from './dummyAlbums.json';
import dummyActiveWorkouts from './dummyActiveWorkouts.json';

// Simulate unique ID generation
const generateId = () => {
  const id = Math.random().toString(36).substr(2, 9);
  console.log(`Generated ID: ${id}`);
  return id;
};

// Maintain a current state of goals, albums, and active workouts in memory
let currentGoals = [...dummyGoalData];
let currentAlbums = { ...dummyAlbums };
let currentActiveWorkouts = [...dummyActiveWorkouts.activeWorkouts];

const API_URL = 'http://localhost:3000/api/profiles'; // Adjust the URL as needed

export const fetchProfileData = async (profileId) => {
  try {
    const response = await fetch(`${API_URL}/${profileId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
  }
};

export const fetchGoalData = () => {
  return currentGoals;
};

export const saveGoalData = (goals) => {
  console.log('Saving goals:', JSON.stringify(goals, null, 2));
  currentGoals = [...goals];
  // Here you would replace the console log with an API call to save the data
};

export const addGoal = (newGoal) => {
  newGoal.id = generateId();
  console.log('Adding new goal:', newGoal);
  currentGoals.push(newGoal);
  saveGoalData(currentGoals);
  return newGoal;
};

export const updateGoal = (updatedGoal) => {
  console.log('updateGoal called with:', updatedGoal); // Add this line for debugging
  const index = currentGoals.findIndex(goal => goal.id === updatedGoal.id);
  console.log('Goal index found:', index); // Add this line for debugging
  if (index !== -1) {
    currentGoals[index] = updatedGoal;
    saveGoalData(currentGoals);
    console.log('Goal updated:', updatedGoal); // Console log added here
  } else {
    console.log('Goal not found:', updatedGoal.id); // Add this line for debugging
  }
  return updatedGoal;
};

export const deleteGoal = (goalId) => {
  currentGoals = currentGoals.filter(goal => goal.id !== goalId);
  saveGoalData(currentGoals);
  return currentGoals;
};

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

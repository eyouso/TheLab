// dataService.js
import dummyProfileData from './dummyProfileData.json';
import dummyGoalData from './dummyGoalData.json';
import dummyAlbums from './dummyAlbums.json';

// Simulate unique ID generation
const generateId = () => {
  const id = Math.random().toString(36).substr(2, 9);
  console.log(`Generated ID: ${id}`);
  return id;
};

// Maintain a current state of goals and albums in memory
let currentGoals = [...dummyGoalData];
let currentAlbums = { ...dummyAlbums };

export const fetchProfileData = () => {
  return dummyProfileData;
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
  const index = currentGoals.findIndex(goal => goal.id === updatedGoal.id);
  if (index !== -1) {
    currentGoals[index] = updatedGoal;
    saveGoalData(currentGoals);
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

export const fetchAlbumById = (albumId) => {
  return Object.values(currentAlbums).flat().find(album => album.id === albumId);
};

export const saveAlbums = (albums) => {
  console.log('Saving albums:', JSON.stringify(albums, null, 2));
  currentAlbums = { ...albums };
  // Replace with an API call to save the data
};

export const addWorkoutToAlbum = (albumId, workout, overwrite = false) => {
  const album = currentAlbums.myLibraryAlbums.find(album => album.id === albumId);
  if (album) {
    const existingWorkoutIndex = album.workouts.findIndex(w => w.title === workout.title);
    if (existingWorkoutIndex !== -1) {
      if (overwrite) {
        album.workouts[existingWorkoutIndex] = { ...workout, id: album.workouts[existingWorkoutIndex].id };
        console.log(`Overwritten workout in album ${albumId}:`, workout);
      } else {
        return false;
      }
    } else {
      workout.id = generateId();
      album.workouts.push(workout);
      console.log(`Added workout to album ${albumId}:`, workout);
    }
    saveAlbums(currentAlbums);
    return true;
  }
  return false;
};

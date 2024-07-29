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

// New deleteAlbum method
export const deleteAlbum = (albumId) => {
  const albumIndex = currentAlbums.myLibraryAlbums.findIndex(album => album.id === albumId);
  if (albumIndex !== -1) {
    currentAlbums.myLibraryAlbums.splice(albumIndex, 1);
    saveAlbums(currentAlbums);
    return true;
  }
  return false;
};

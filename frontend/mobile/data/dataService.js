import dummyAlbums from './dummyAlbums.json';
import dummyActiveWorkouts from './dummyActiveWorkouts.json';

const generateId = () => {
  const id = Math.random().toString(36).substr(2, 9);
  console.log(`Generated ID: ${id}`);
  return id;
};

// Maintain a current state of albums and active workouts in memory
let currentAlbums = { ...dummyAlbums };
let currentActiveWorkouts = [...dummyActiveWorkouts.activeWorkouts];

export const API_URL = 'http://192.168.0.76:3000/api'; // Adjust the URL as needed

// Albums-related functions
export const fetchAlbums = () => {
  return currentAlbums;
};

export const addAlbum = (newAlbum) => {
  newAlbum.id = generateId();
  currentAlbums.myLibraryAlbums.push(newAlbum);
  saveAlbums(currentAlbums);
  return newAlbum;
};

export const saveAlbums = (albums) => {
  console.log('Saving albums:', JSON.stringify(albums, null, 2));
  currentAlbums = { ...albums };
  // Replace console.log with an API call to save the data if needed
};

export const addWorkoutToAlbum = (albumId, workout, overwrite = false) => {
  const album = currentAlbums.myLibraryAlbums.find(a => a.id === albumId) ||
    currentAlbums.teamLibraryAlbums.find(a => a.id === albumId) ||
    currentAlbums.communityLibraryAlbums.find(a => a.id === albumId);

  if (!album) {
    console.error(`Album with ID ${albumId} not found`);
    return false;
  }

  if (!workout.id) {
    workout.id = generateId();
  }

  const existingWorkoutIndex = album.contents.findIndex(w => w.title === workout.title);

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

// Active workouts-related functions
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
  // Replace console.log with an API call to save the data if needed
};

export const removeDrillLiftFromWorkout = (workoutId, drillLiftId) => {
  const workoutIndex = currentActiveWorkouts.findIndex(workout => workout.id === workoutId);
  if (workoutIndex !== -1) {
    const workout = currentActiveWorkouts[workoutIndex];
    workout.drillLifts = workout.drillLifts.filter(drillLift => drillLift.id !== drillLiftId);
    updateActiveWorkout(workout);
  }
};

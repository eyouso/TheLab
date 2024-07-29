import React, { createContext, useState, useEffect } from 'react';
import { fetchActiveWorkouts, addActiveWorkout, deleteActiveWorkout } from '../data/dataService';

export const ActiveWorkoutContext = createContext();

export const ActiveWorkoutProvider = ({ children }) => {
  const [activeWorkouts, setActiveWorkouts] = useState([]);

  useEffect(() => {
    const workouts = fetchActiveWorkouts();
    setActiveWorkouts(workouts);
  }, []);

  const addWorkout = (workout) => {
    addActiveWorkout(workout); // Add workout to backend
    setActiveWorkouts(fetchActiveWorkouts()); // Fetch updated list of workouts from backend
  };

  const removeWorkout = (workoutId) => {
    deleteActiveWorkout(workoutId);
    setActiveWorkouts(fetchActiveWorkouts()); // Fetch updated list of workouts from backend
  };

  return (
    <ActiveWorkoutContext.Provider value={{ activeWorkouts, addWorkout, removeWorkout }}>
      {children}
    </ActiveWorkoutContext.Provider>
  );
};

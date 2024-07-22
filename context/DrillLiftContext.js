import React, { createContext, useState } from 'react';

export const DrillLiftContext = createContext();

export const DrillLiftProvider = ({ children }) => {
  const [drillLiftsByWorkout, setDrillLiftsByWorkout] = useState({});

  const addDrillLiftToWorkout = (workoutId, drillLift) => {
    setDrillLiftsByWorkout((current) => ({
      ...current,
      [workoutId]: current[workoutId] ? [...current[workoutId], drillLift] : [drillLift],
    }));
  };

  const updateDrillLift = (workoutId, drillLiftId, newDetails) => {
    setDrillLiftsByWorkout((current) => ({
      ...current,
      [workoutId]: current[workoutId].map((drillLift) =>
        drillLift.id === drillLiftId ? { ...drillLift, ...newDetails } : drillLift
      ),
    }));
  };

  const deleteDrillLift = (workoutId, drillLiftId) => {
    setDrillLiftsByWorkout((current) => ({
      ...current,
      [workoutId]: current[workoutId].filter((drillLift) => drillLift.id !== drillLiftId),
    }));
  };

  return (
    <DrillLiftContext.Provider
      value={{
        drillLiftsByWorkout,
        setDrillLiftsByWorkout,
        addDrillLiftToWorkout,
        updateDrillLift,
        deleteDrillLift,
      }}
    >
      {children}
    </DrillLiftContext.Provider>
  );
};

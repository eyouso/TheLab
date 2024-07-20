// DrillLiftContext.js
import React, { createContext, useState } from 'react';

export const DrillLiftContext = createContext();

export const DrillLiftProvider = ({ children }) => {
  const [drillLifts, setDrillLifts] = useState([]);

  const updateDrillLift = (id, newDetails) => {
    setDrillLifts((currentDrillLifts) =>
      currentDrillLifts.map((drillLift) =>
        drillLift.id === id ? { ...drillLift, ...newDetails } : drillLift
      )
    );
  };

  const deleteDrillLift = (id) => {
    setDrillLifts((currentDrillLifts) => currentDrillLifts.filter(drillLift => drillLift.id !== id));
  };

  return (
    <DrillLiftContext.Provider value={{ drillLifts, setDrillLifts, updateDrillLift, deleteDrillLift }}>
      {children}
    </DrillLiftContext.Provider>
  );
};

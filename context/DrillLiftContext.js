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

  return (
    <DrillLiftContext.Provider value={{ drillLifts, setDrillLifts, updateDrillLift }}>
      {children}
    </DrillLiftContext.Provider>
  );
};

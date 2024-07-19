// DrillLiftContext.js
import React, { createContext, useState } from 'react';

export const DrillLiftContext = createContext();

export const DrillLiftProvider = ({ children }) => {
  const [drillLifts, setDrillLifts] = useState([]);

  const updateDrillLiftName = (id, newName) => {
    setDrillLifts((currentDrillLifts) =>
      currentDrillLifts.map((drillLift) =>
        drillLift.id === id ? { ...drillLift, value: newName } : drillLift
      )
    );
  };

  return (
    <DrillLiftContext.Provider value={{ drillLifts, setDrillLifts, updateDrillLiftName }}>
      {children}
    </DrillLiftContext.Provider>
  );
};

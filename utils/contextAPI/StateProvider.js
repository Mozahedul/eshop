import React, { createContext, useContext, useReducer } from 'react';

// create a central data store or layer
// createContext() method returns a context object.
// context object will hold two components, Provider and Consumer
export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);

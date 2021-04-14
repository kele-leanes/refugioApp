import React, { createContext, useReducer, useContext } from 'react';
import { printerReducer } from './PrinterReducer';

export const PrinterContext = createContext(initialState);

export const usePrinter = () => {
  const { state, dispatch } = useContext(PrinterContext);
  return [state, dispatch];
};

const initialState = {
  printer: null,
  loading: false,
  error: null,
};

export const PrintProvider = ({ children }) => {
  const [state, dispatch] = useReducer(printerReducer, initialState);

  return (
    <PrinterContext.Provider value={{ state: state, dispatch: dispatch }}>
      {children}
    </PrinterContext.Provider>
  );
};

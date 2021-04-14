export const printerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRINTER':
      return {
        ...state,
        printer: action.payload,
      };
    default:
      return state;
  }
};

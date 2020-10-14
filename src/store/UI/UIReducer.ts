import { UIState, START_ACTION, STOP_ACTION, UIActionTypes } from './UITypes';

// creates a data loader for different data entities
const initialState: UIState = {
  loader: {
    actions: [],
    refreshing: [],
  },
};

const UIReducer = (state = initialState, action: UIActionTypes): UIState => {
  const { loader } = state;
  const { actions } = loader;
  switch (action.type) {
    case START_ACTION:
      return {
        ...state,
        loader: {
          ...loader,
          actions: [...actions, action.payload],
        },
      };
    case STOP_ACTION:
      return {
        ...state,
        loader: {
          ...loader,
          actions: actions.filter((item) => item !== action.payload),
        },
      };
    default:
      return state;
  }
};

export default UIReducer;

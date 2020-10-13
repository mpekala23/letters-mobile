import { UIState, START_ACTION, STOP_ACTION } from './UITypes';

// creates a data loader for different data entities
const initialState: UIState = {
  loader: {
    actions: [],
  },
};

const uiReducer = (state = initialState, { type, payload }): UIState => {
  const { loader } = state;
  const { actions } = loader;
  switch (type) {
    case START_ACTION:
      return {
        ...state,
        loader: {
          ...loader,
          actions: [...actions, payload.action],
        },
      };
    case STOP_ACTION:
      return {
        ...state,
        loader: {
          ...loader,
          actions: actions.filter((action) => action.name !== payload.name),
        },
      };
    default:
      return state;
  }
};

export default uiReducer;

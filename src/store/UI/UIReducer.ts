import {
  UIState,
  START_ACTION,
  STOP_ACTION,
  UIActionTypes,
  SET_TOPBAR_RIGHT,
  SET_TOPBAR_LEFT,
} from './UITypes';

// creates a data loader for different data entities
const initialState: UIState = {
  loader: {
    actions: [],
  },
  topbarRight: null,
  topbarLeft: null,
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
    case SET_TOPBAR_RIGHT:
      return {
        ...state,
        topbarRight: action.payload,
      };
    case SET_TOPBAR_LEFT:
      return {
        ...state,
        topbarLeft: action.payload,
      };
    default:
      return state;
  }
};

export default UIReducer;

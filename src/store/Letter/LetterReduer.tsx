import {
  LetterState,
  LetterActionTypes,
  SET_COMPOSING,
  SET_TYPE,
  SET_RECIPIENT,
  SET_MESSAGE,
  SET_PHOTO_PATH,
  CLEAR_COMPOSING,
  SET_EXISTING,
} from "./LetterTypes";
import { LetterTypes } from "types";

const initialState: LetterState = {
  composing: {
    type: LetterTypes.PostCards,
    recipient: null,
    message: "",
    photoPath: "",
  },
  existing: [],
};

export default function LetterReducer(
  state = initialState,
  action: LetterActionTypes
): LetterState {
  const currentState = { ...state };
  switch (action.type) {
    case SET_COMPOSING:
      currentState.composing = action.payload;
      return currentState;
    case SET_TYPE:
      currentState.composing.type = action.payload;
      return currentState;
    case SET_RECIPIENT:
      currentState.composing.recipient = action.payload;
      return currentState;
    case SET_MESSAGE:
      currentState.composing.message = action.payload;
      return currentState;
    case SET_PHOTO_PATH:
      currentState.composing.photoPath = action.payload;
      return currentState;
    case CLEAR_COMPOSING:
      currentState.composing = initialState.composing;
      return currentState;
    case SET_EXISTING:
      currentState.existing = action.payload;
      return currentState;
    default:
      return currentState;
  }
}

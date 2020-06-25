import { LetterTypes, LetterStatus } from 'types';
import {
  LetterState,
  LetterActionTypes,
  SET_COMPOSING,
  SET_TYPE,
  SET_STATUS,
  SET_DRAFT,
  SET_RECIPIENT_ID,
  SET_MESSAGE,
  SET_PHOTO_PATH,
  SET_LETTER_ID,
  CLEAR_COMPOSING,
  SET_EXISTING,
  ADD_LETTER,
} from './LetterTypes';

const initialState: LetterState = {
  composing: {
    type: LetterTypes.PostCards,
    status: LetterStatus.Draft,
    isDraft: true,
    recipientId: -1,
    recipientName: '',
    message: '',
    photoPath: '',
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
    case SET_STATUS:
      currentState.composing.status = action.payload;
      return currentState;
    case SET_DRAFT:
      currentState.composing.isDraft = action.payload;
      return currentState;
    case SET_RECIPIENT_ID:
      currentState.composing.recipientId = action.payload;
      return currentState;
    case SET_MESSAGE:
      currentState.composing.message = action.payload;
      return currentState;
    case SET_PHOTO_PATH:
      currentState.composing.photoPath = action.payload;
      return currentState;
    case SET_LETTER_ID:
      currentState.composing.letterId = action.payload;
      return currentState;
    case CLEAR_COMPOSING:
      currentState.composing = initialState.composing;
      return currentState;
    case SET_EXISTING:
      currentState.existing = action.payload;
      return currentState;
    case ADD_LETTER:
      if (action.payload.recipientId in currentState.existing) {
        const existingLetters =
          currentState.existing[action.payload.recipientId];
        let matchIx = 0;
        while (matchIx < existingLetters.length) {
          if (existingLetters[matchIx].letterId === action.payload.letterId) {
            break;
          }
          matchIx += 1;
        }
        if (matchIx < existingLetters.length) {
          existingLetters.splice(matchIx, 1, action.payload);
        } else {
          existingLetters.push(action.payload);
        }
        currentState.existing[action.payload.recipientId] = existingLetters;
      } else {
        currentState.existing[action.payload.recipientId] = [action.payload];
      }
      return currentState;
    default:
      return currentState;
  }
}

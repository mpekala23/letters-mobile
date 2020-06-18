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
} from "./LetterTypes";
import { LetterTypes, LetterStatus } from "types";

const initialState: LetterState = {
  composing: {
    type: LetterTypes.PostCards,
    status: LetterStatus.Draft,
    isDraft: true,
    recipientId: -1,
    message: "",
    photoPath: "",
  },
  existing: {
    8: [
      {
        type: LetterTypes.PostCards,
        status: LetterStatus.Printed,
        isDraft: true,
        recipientId: 8,
        message: "I'm trying out this new service called Ameelio...",
        photoPath: "",
      },
      {
        type: LetterTypes.PostCards,
        status: LetterStatus.OutForDelivery,
        isDraft: false,
        recipientId: 8,
        message: "Hi Emily! How are you doing? I'm trying out this...",
        photoPath: "",
      },
      {
        type: LetterTypes.PostCards,
        status: LetterStatus.Mailed,
        isDraft: false,
        recipientId: 8,
        message: "I'm trying out this new service called Ameelio...",
        photoPath: "",
      },
    ],
  },
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
      if (action.payload.contactId in currentState.existing) {
        currentState.existing[action.payload.contactId].push(
          action.payload.letter
        );
      } else {
        currentState.existing[action.payload.contactId] = [
          action.payload.letter,
        ];
      }
      return currentState;
    default:
      return currentState;
  }
}

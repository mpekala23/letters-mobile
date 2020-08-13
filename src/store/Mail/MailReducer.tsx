import { MailTypes, MailStatus } from 'types';
import {
  SET_COMPOSING,
  SET_RECIPIENT_ID,
  SET_CONTENT,
  SET_IMAGE,
  SET_DESIGN,
  CLEAR_COMPOSING,
  ADD_MAIL,
  SET_ACTIVE,
  SET_STATUS,
  SET_DATE_CREATED,
  SET_EXPECTED_DELIVERY,
  SET_CONTACTS_MAIL,
  SET_EXISTING_MAIL,
  MailActionTypes,
  MailState,
} from './MailTypes';

const initialState: MailState = {
  composing: {
    type: MailTypes.Letter,
    recipientId: -1,
    content: '',
  },
  active: {
    id: -1,
    type: MailTypes.Letter,
    recipientId: -1,
    content: '',
    status: MailStatus.Created,
    dateCreated: new Date(),
    expectedDelivery: new Date(),
  },
  existing: {},
};

export default function LetterReducer(
  state = initialState,
  action: MailActionTypes
): MailState {
  const currentState = { ...state };
  switch (action.type) {
    case SET_COMPOSING:
      currentState.composing = action.payload;
      return currentState;
    case SET_RECIPIENT_ID:
      currentState.composing.recipientId = action.payload;
      return currentState;
    case SET_CONTENT:
      currentState.composing.content = action.payload;
      return currentState;
    case SET_IMAGE:
      if (currentState.composing.type !== MailTypes.Letter) return currentState;
      currentState.composing.image = action.payload;
      return currentState;
    case SET_DESIGN:
      if (currentState.composing.type !== MailTypes.Postcard)
        return currentState;
      currentState.composing.design = action.payload;
      return currentState;
    case CLEAR_COMPOSING:
      currentState.composing = {
        type: MailTypes.Letter,
        recipientId: -1,
        content: '',
      };
      return currentState;
    case ADD_MAIL:
      if (action.payload.recipientId in currentState.existing) {
        currentState.existing[action.payload.recipientId].unshift(
          action.payload
        );
      } else {
        currentState.existing[action.payload.recipientId] = [action.payload];
      }
      return currentState;
    case SET_ACTIVE:
      currentState.active = action.payload;
      return currentState;
    case SET_STATUS:
      if (!(action.payload.contactId in currentState.existing))
        return currentState;
      for (
        let ix = 0;
        ix < currentState.existing[action.payload.contactId].length;
        ix += 1
      ) {
        if (
          currentState.existing[action.payload.contactId][ix].id ===
          action.payload.mailId
        ) {
          currentState.existing[action.payload.contactId][ix].status =
            action.payload.status;
          break;
        }
      }
      return currentState;
    case SET_DATE_CREATED:
      if (!(action.payload.contactId in currentState.existing))
        return currentState;
      for (
        let ix = 0;
        ix < currentState.existing[action.payload.contactId].length;
        ix += 1
      ) {
        if (
          currentState.existing[action.payload.contactId][ix].id ===
          action.payload.mailId
        ) {
          currentState.existing[action.payload.contactId][ix].dateCreated =
            action.payload.dateCreated;
          break;
        }
      }
      return currentState;
    case SET_EXPECTED_DELIVERY:
      if (!(action.payload.contactId in currentState.existing))
        return currentState;
      for (
        let ix = 0;
        ix < currentState.existing[action.payload.contactId].length;
        ix += 1
      ) {
        if (
          currentState.existing[action.payload.contactId][ix].id ===
          action.payload.mailId
        ) {
          currentState.existing[action.payload.contactId][ix].expectedDelivery =
            action.payload.expectedDelivery;
          break;
        }
      }
      return currentState;
    case SET_CONTACTS_MAIL:
      currentState.existing[action.payload.contactId] = action.payload.mail;
      return currentState;
    case SET_EXISTING_MAIL:
      currentState.existing = action.payload;
      return currentState;
    default:
      return currentState;
  }
}

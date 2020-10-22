import { Mail, MailTypes } from 'types';
import {
  SET_COMPOSING,
  SET_RECIPIENT_ID,
  SET_CONTENT,
  SET_IMAGES,
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
  SET_MAIL_IMAGES,
} from './MailTypes';

const initialState: MailState = {
  composing: {
    type: MailTypes.Letter,
    recipientId: -1,
    content: '',
    images: [],
  },
  active: null,
  existing: {},
};

export default function LetterReducer(
  state = initialState,
  action: MailActionTypes
): MailState {
  const currentState = { ...state };
  let ix = -1;
  let mailItem: Mail;
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
    case SET_IMAGES:
      if (currentState.composing.type !== MailTypes.Letter) return currentState;
      currentState.composing.images = action.payload;
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
        images: [],
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
        ix = 0;
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
      currentState.existing = { ...currentState.existing };
      return currentState;
    case SET_DATE_CREATED:
      if (!(action.payload.contactId in currentState.existing))
        return currentState;
      for (
        ix = 0;
        ix < currentState.existing[action.payload.contactId].length;
        ix += 1
      ) {
        if (
          currentState.existing[action.payload.contactId][ix].id ===
          action.payload.mailId
        ) {
          currentState.existing[action.payload.contactId][
            ix
          ].dateCreated = action.payload.dateCreated.toISOString();
          break;
        }
      }
      currentState.existing = { ...currentState.existing };
      return currentState;
    case SET_EXPECTED_DELIVERY:
      if (!(action.payload.contactId in currentState.existing))
        return currentState;
      for (
        ix = 0;
        ix < currentState.existing[action.payload.contactId].length;
        ix += 1
      ) {
        if (
          currentState.existing[action.payload.contactId][ix].id ===
          action.payload.mailId
        ) {
          currentState.existing[action.payload.contactId][
            ix
          ].expectedDelivery = action.payload.expectedDelivery.toISOString();
          break;
        }
      }
      currentState.existing = { ...currentState.existing };
      return currentState;
    case SET_MAIL_IMAGES:
      if (!(action.payload.contactId in currentState.existing))
        return currentState;
      ix = currentState.existing[action.payload.contactId].findIndex(
        (testMail) => testMail.id === action.payload.mailId
      );
      if (ix < 0) return currentState;
      mailItem = currentState.existing[action.payload.contactId][ix];
      if (mailItem.type === MailTypes.Postcard) {
        if (!action.payload.images.length) return currentState;
        [mailItem.design.asset] = action.payload.images;
        currentState.existing[action.payload.contactId][ix] = { ...mailItem };
        return currentState;
      }
      mailItem.images = action.payload.images;
      currentState.existing[action.payload.contactId][ix] = { ...mailItem };
      return currentState;
    case SET_CONTACTS_MAIL:
      currentState.existing[action.payload.contactId] = action.payload.mail;
      currentState.existing = { ...currentState.existing };
      return currentState;
    case SET_EXISTING_MAIL:
      currentState.existing = action.payload;
      return currentState;
    default:
      return currentState;
  }
}

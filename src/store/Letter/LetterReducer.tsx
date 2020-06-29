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
  SET_ACTIVE_LETTER,
} from './LetterTypes';

const initialState: LetterState = {
  composing: {
    type: LetterTypes.PostCards,
    status: LetterStatus.Draft,
    isDraft: true,
    recipientId: -1,
    message: '',
    photoPath: '',
    dateCreated: '06/29/20',
    trackingEvents: [],
  },
  active: {
    type: LetterTypes.PostCards,
    status: LetterStatus.Created,
    isDraft: true,
    recipientId: -1,
    message: '',
    photoPath: '',
    dateCreated: '06/29/20',
    trackingEvents: [],
  },
  existing: {
    8: [
      {
        letterId: 1,
        type: LetterTypes.PostCards,
        status: LetterStatus.Mailed,
        isDraft: true,
        recipientId: 8,
        message: "I'm trying out this new service called Ameelio...",
        expectedDeliveryDate: '2019-06-30',
        trackingEvents: [
          {
            id: 1,
            name: LetterStatus.Mailed,
            location: '20002',
            date: '2019-07-12T15:51:41.000Z',
          },
        ],
        dateCreated: '06/29/20',
        photoPath:
          'https://wp.lob.com/wp-content/uploads/2020/04/ameelio_logo_blog.jpg',
      },
      {
        letterId: 2,
        type: LetterTypes.PostCards,
        status: LetterStatus.InTransit,
        isDraft: true,
        recipientId: 8,
        expectedDeliveryDate: '2019-06-30',
        trackingEvents: [
          {
            id: 1,
            name: LetterStatus.InTransit,
            location: '90210',
            date: '2019-06-25T12:28:41.000Z',
          },
          {
            id: 2,
            name: LetterStatus.Mailed,
            location: '10001',
            date: '2019-06-23T15:51:41.000Z',
          },
        ],
        message:
          "Hi Emily! How are you doing? I'm sending you a letter through Ameelio. It is a great service! ",
        dateCreated: '06/26/20',
        photoPath:
          'https://wp.lob.com/wp-content/uploads/2020/04/ameelio_logo_blog.jpg',
      },
      {
        letterId: 3,
        type: LetterTypes.PostCards,
        status: LetterStatus.OutForDelivery,
        isDraft: false,
        recipientId: 8,
        message: "I'm trying out this new service called Ameelio...",
        dateCreated: '06/14/20',
        photoPath:
          'https://wp.lob.com/wp-content/uploads/2020/04/ameelio_logo_blog.jpg',
        expectedDeliveryDate: '2019-06-30',
        trackingEvents: [
          {
            id: 2,
            name: LetterStatus.OutForDelivery,
            location: '06520',
            date: '2019-06-30T15:21:41.000Z',
          },
          {
            id: 3,
            name: LetterStatus.InLocalArea,
            location: '06511',
            date: '2019-06-29T14:38:41.000Z',
          },
          {
            id: 4,
            name: LetterStatus.InTransit,
            location: '90210',
            date: '2019-06-25T12:28:41.000Z',
          },
          {
            id: 5,
            name: LetterStatus.Mailed,
            location: '20002',
            date: '2019-06-23T15:11:41.000Z',
          },
        ],
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
    case SET_ACTIVE_LETTER:
      currentState.active = action.payload;
      return currentState;
    default:
      return currentState;
  }
}

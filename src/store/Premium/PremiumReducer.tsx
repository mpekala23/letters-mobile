import {
  SET_PACKS,
  SET_PREMIUM_CATEGORIES,
  SET_TRANSACTIONS,
  PremiumActionTypes,
  PremiumState,
  SET_SHOWN_PROMPT,
} from './PremiumTypes';

const initialState: PremiumState = {
  premiumPacks: [],
  premiumCategories: [],
  transactions: [],
  hasShownPrompt: false,
};

export default function PremiumReducer(
  state = initialState,
  action: PremiumActionTypes
): PremiumState {
  switch (action.type) {
    case SET_PACKS:
      return {
        ...state,
        premiumPacks: action.payload,
      };
    case SET_PREMIUM_CATEGORIES:
      return {
        ...state,
        premiumCategories: action.payload,
      };
    case SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
      };
    case SET_SHOWN_PROMPT:
      return {
        ...state,
        hasShownPrompt: action.payload,
      };
    default:
      return state;
  }
}

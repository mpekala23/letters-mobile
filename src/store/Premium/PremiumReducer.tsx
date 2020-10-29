import {
  SET_PACKS,
  SET_PREMIUM_CATEGORIES,
  SET_PREMIUM_TRANSACTIONS,
  SET_STRIPE_TRANSACTIONS,
  PremiumActionTypes,
  PremiumState,
  SET_SHOWN_PROMPT,
  ADD_STRIPE_TRANSACTION,
} from './PremiumTypes';

const initialState: PremiumState = {
  premiumPacks: [],
  premiumCategories: [],
  premiumTransactions: [],
  stripeTransactions: [],
  hasShownPrompt: false,
};

export default function PremiumReducer(
  state = initialState,
  action: PremiumActionTypes
): PremiumState {
  switch (action.type) {
    case ADD_STRIPE_TRANSACTION:
      return {
        ...state,
        stripeTransactions: [action.payload, ...state.stripeTransactions],
      };
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
    case SET_PREMIUM_TRANSACTIONS:
      return {
        ...state,
        premiumTransactions: action.payload,
      };
    case SET_STRIPE_TRANSACTIONS:
      return {
        ...state,
        stripeTransactions: action.payload,
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

import {
  SET_PACKS,
  PremiumActionTypes,
  PremiumState,
  SET_PREMIUM_CATEGORIES,
} from './PremiumTypes';

const initialState: PremiumState = {
  premiumPacks: [],
  premiumCategories: [],
};

export default function PremiumReducer(
  state = initialState,
  action: PremiumActionTypes
): PremiumState {
  switch (action.type) {
    case SET_PACKS:
      return { ...state, premiumPacks: action.payload };
    case SET_PREMIUM_CATEGORIES:
      return { ...state, premiumCategories: action.payload };
    default:
      return state;
  }
}

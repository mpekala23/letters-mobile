import { SET_PACKS, PremiumActionTypes, PremiumState } from './PremiumTypes';

const initialState: PremiumState = {
  premiumPacks: [],
};

export default function PremiumReducer(
  state = initialState,
  action: PremiumActionTypes
): PremiumState {
  switch (action.type) {
    case SET_PACKS:
      return { ...state, premiumPacks: action.payload };
    default:
      return state;
  }
}

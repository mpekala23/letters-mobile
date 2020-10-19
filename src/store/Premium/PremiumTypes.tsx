import { PremiumPack } from 'types';

// Premium packs actions
export const SET_PACKS = 'premium/set_packs';

export interface PremiumState {
  premiumPacks: PremiumPack[];
}

interface SetPacksAction {
  type: typeof SET_PACKS;
  payload: PremiumPack[];
}

export type PremiumActionTypes = SetPacksAction;

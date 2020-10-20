import { Category, PremiumPack } from 'types';

// Premium packs actions
export const SET_PACKS = 'premium/set_packs';
export const SET_PREMIUM_CATEGORIES = 'premium/set_categories';

export interface PremiumState {
  premiumPacks: PremiumPack[];
  premiumCategories: Category[];
}

interface SetPacksAction {
  type: typeof SET_PACKS;
  payload: PremiumPack[];
}

interface SetPremiumCategoriesAction {
  type: typeof SET_PREMIUM_CATEGORIES;
  payload: Category[];
}

export type PremiumActionTypes = SetPacksAction | SetPremiumCategoriesAction;

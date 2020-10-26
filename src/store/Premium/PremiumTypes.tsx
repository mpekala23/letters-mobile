import { Category, PremiumPack, Transaction } from 'types';

// Premium packs actions
export const SET_PACKS = 'premium/set_packs';
export const SET_PREMIUM_CATEGORIES = 'premium/set_categories';
export const SET_TRANSACTIONS = 'premium/set_transactions';

export interface PremiumState {
  premiumPacks: PremiumPack[];
  premiumCategories: Category[];
  transactions: Transaction[];
}

interface SetPacksAction {
  type: typeof SET_PACKS;
  payload: PremiumPack[];
}

interface SetPremiumCategoriesAction {
  type: typeof SET_PREMIUM_CATEGORIES;
  payload: Category[];
}

interface SetTransactionsAction {
  type: typeof SET_TRANSACTIONS;
  payload: Transaction[];
}

export type PremiumActionTypes =
  | SetPacksAction
  | SetPremiumCategoriesAction
  | SetTransactionsAction;

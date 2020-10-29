import {
  Category,
  PremiumPack,
  PremiumTransaction,
  StripeTransaction,
} from 'types';

// Premium packs actions
export const SET_PACKS = 'premium/set_packs';
export const SET_PREMIUM_CATEGORIES = 'premium/set_categories';
export const SET_PREMIUM_TRANSACTIONS = 'premium/set_premium_transactions';
export const SET_STRIPE_TRANSACTIONS = 'premium/set_stripe_transactions';
export const SET_SHOWN_PROMPT = 'premium/set_shown_prompt';
export const ADD_STRIPE_TRANSACTION = 'premium/add_stripe_transactions';

export interface PremiumState {
  premiumPacks: PremiumPack[];
  premiumCategories: Category[];
  premiumTransactions: PremiumTransaction[];
  stripeTransactions: StripeTransaction[];
  hasShownPrompt: boolean;
}

interface SetPacksAction {
  type: typeof SET_PACKS;
  payload: PremiumPack[];
}

interface SetPremiumCategoriesAction {
  type: typeof SET_PREMIUM_CATEGORIES;
  payload: Category[];
}

interface SetPremiumTransactionsAction {
  type: typeof SET_PREMIUM_TRANSACTIONS;
  payload: PremiumTransaction[];
}

interface SetStripeTransactionsAction {
  type: typeof SET_STRIPE_TRANSACTIONS;
  payload: StripeTransaction[];
}

interface AddStripeTransactionsAction {
  type: typeof ADD_STRIPE_TRANSACTION;
  payload: StripeTransaction;
}

interface SetShownPromptAction {
  type: typeof SET_SHOWN_PROMPT;
  payload: boolean;
}

export type PremiumActionTypes =
  | AddStripeTransactionsAction
  | SetPacksAction
  | SetPremiumCategoriesAction
  | SetPremiumTransactionsAction
  | SetStripeTransactionsAction
  | SetShownPromptAction;

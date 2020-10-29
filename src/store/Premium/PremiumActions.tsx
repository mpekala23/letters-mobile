import {
  Category,
  PremiumPack,
  PremiumTransaction,
  StripeTransaction,
} from 'types';
import {
  ADD_STRIPE_TRANSACTION,
  SET_PACKS,
  SET_PREMIUM_CATEGORIES,
  SET_PREMIUM_TRANSACTIONS,
  SET_STRIPE_TRANSACTIONS,
  PremiumActionTypes,
  SET_SHOWN_PROMPT,
} from './PremiumTypes';

export function setPremiumPacks(
  premiumPacks: PremiumPack[]
): PremiumActionTypes {
  return {
    type: SET_PACKS,
    payload: premiumPacks,
  };
}

export function setPremiumCategories(
  categories: Category[]
): PremiumActionTypes {
  return {
    type: SET_PREMIUM_CATEGORIES,
    payload: categories,
  };
}

export function setPremiumTransactions(
  transactions: PremiumTransaction[]
): PremiumActionTypes {
  return {
    type: SET_PREMIUM_TRANSACTIONS,
    payload: transactions,
  };
}

export function setStripeTransactions(
  transactions: StripeTransaction[]
): PremiumActionTypes {
  return {
    type: SET_STRIPE_TRANSACTIONS,
    payload: transactions,
  };
}

export function addStripeTransaction(
  transaction: StripeTransaction
): PremiumActionTypes {
  return {
    type: ADD_STRIPE_TRANSACTION,
    payload: transaction,
  };
}

export function setShownPrompt(val: boolean): PremiumActionTypes {
  return {
    type: SET_SHOWN_PROMPT,
    payload: val,
  };
}

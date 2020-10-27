import { Category, PremiumPack, Transaction } from 'types';
import {
  SET_PACKS,
  SET_PREMIUM_CATEGORIES,
  SET_TRANSACTIONS,
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

export function setTransactions(
  transactions: Transaction[]
): PremiumActionTypes {
  return {
    type: SET_TRANSACTIONS,
    payload: transactions,
  };
}

export function setShownPrompt(val: boolean): PremiumActionTypes {
  return {
    type: SET_SHOWN_PROMPT,
    payload: val,
  };
}

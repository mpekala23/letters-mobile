/* eslint-disable import/prefer-default-export */
import { Category, PremiumPack } from 'types';
import {
  SET_PACKS,
  PremiumActionTypes,
  SET_PREMIUM_CATEGORIES,
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

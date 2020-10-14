/* eslint-disable import/prefer-default-export */
import { PremiumPack } from 'types';
import { SET_PACKS, PremiumActionTypes } from './PremiumTypes';

export function setPremiumPacks(
  premiumPacks: PremiumPack[]
): PremiumActionTypes {
  return {
    type: SET_PACKS,
    payload: premiumPacks,
  };
}

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

// dummy line so that eslint stops complaining about default export. remove when we add another real function here
export function dummyfunction(premiumPacks: PremiumPack[]): PremiumActionTypes {
  return {
    type: SET_PACKS,
    payload: premiumPacks,
  };
}

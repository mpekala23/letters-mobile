/* eslint-disable camelcase */
import { setPremiumPacks } from '@store/Premium/PremiumActions';
import store from '@store';
import url from 'url';
import { PremiumPack } from 'types';
import { API_URL, fetchAuthenticated } from './Common';

interface RawPremiumPack {
  name: string;
  id: number;
  price: number;
  coins: number;
  img_path: string;
  created_at: string;
  updated_at: string;
}

function cleanPremiumPack(pack: RawPremiumPack): PremiumPack {
  return {
    id: pack.id,
    coins: pack.coins,
    price: pack.price,
    name: pack.name,
    image: pack.img_path,
  };
}

export async function getPremiumPacks(): Promise<PremiumPack[]> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `packs`));
  const data = body.data as RawPremiumPack[];
  if (body.status !== 'OK' || !body.data) throw body;
  const packs = data.map((item: RawPremiumPack) =>
    cleanPremiumPack(item)
  ) as PremiumPack[];
  store.dispatch(setPremiumPacks(packs));
  return packs;
}

// dummy line so that eslint stops complaining about default export. remove when we add another real function here
export function dummyfunction(): void {
  // nothing
}

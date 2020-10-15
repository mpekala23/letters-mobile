/* eslint-disable camelcase */
import { setPremiumPacks } from '@store/Premium/PremiumActions';
import { startAction, stopAction } from '@store/UI/UIActions';
import store from '@store';
import url from 'url';
import { EntityTypes, PremiumPack } from 'types';
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
    image: { uri: pack.img_path },
  };
}

// eslint-disable-next-line import/prefer-default-export
export async function getPremiumPacks(): Promise<PremiumPack[]> {
  store.dispatch(startAction(EntityTypes.PremiumPacks));
  const body = await fetchAuthenticated(url.resolve(API_URL, `packs`));
  const data = body.data as RawPremiumPack[];
  if (body.status !== 'OK' || !body.data) {
    store.dispatch(stopAction(EntityTypes.PremiumPacks));
    throw body;
  }
  const packs = data.map((item: RawPremiumPack) =>
    cleanPremiumPack(item)
  ) as PremiumPack[];
  store.dispatch(setPremiumPacks(packs));
  store.dispatch(stopAction(EntityTypes.PremiumPacks));
  return packs;
}

/* eslint-disable camelcase */
import {
  setPremiumCategories,
  setPremiumPacks,
} from '@store/Premium/PremiumActions';
import { startAction, stopAction } from '@store/UI/UIActions';
import store from '@store';
import url from 'url';
import { Category, EntityTypes, PremiumPack, RawCategory } from 'types';
import { API_URL, fetchAuthenticated } from './Common';
import { cleanCategory, getSubcategoriesById } from './Mail';

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

export async function getPremiumStoreItems(): Promise<void> {
  store.dispatch(startAction(EntityTypes.PremiumStoreItems));
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `categories?premium=true`)
  );
  console.log(body);

  if (body.status !== 'OK' || !body.data) {
    store.dispatch(stopAction(EntityTypes.PremiumPacks));
    throw body;
  }

  const data = body.data as RawCategory[];

  const categories: Category[] = await Promise.all(
    data.map(async (raw: RawCategory) => {
      const subcategories = await getSubcategoriesById(raw.id);
      return cleanCategory(raw, subcategories);
    })
  );
  store.dispatch(setPremiumCategories(categories));
  store.dispatch(stopAction(EntityTypes.PremiumStoreItems));
}

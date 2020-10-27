/* eslint-disable camelcase */
import {
  setPremiumCategories,
  setPremiumPacks,
  setPremiumTransactions,
  setStripeTransactions,
} from '@store/Premium/PremiumActions';
import { startAction, stopAction } from '@store/UI/UIActions';
import store from '@store';
import url from 'url';
import {
  Category,
  EntityTypes,
  PremiumPack,
  PremiumTransaction,
  RawCategory,
  StripeTransaction,
} from 'types';
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

interface RawPremiumTransaction {
  id: number;
  created_at: string;
  user_id: number;
  product_id: number;
  letter_id: number;
  price: number;
  status: 'error' | 'completed' | 'refund';
  contact: {
    id: number;
    first_name: string;
    last_name: string;
  };
  product: {
    id: number;
    price: number;
    name: string;
    thumbnail_src: string;
  };
  premium: boolean;
}

function cleanPremiumTransaction(
  raw: RawPremiumTransaction
): PremiumTransaction {
  let status: 'completed' | 'error' | 'refund';
  switch (raw.status) {
    case 'completed':
      status = 'completed';
      break;
    case 'error':
      status = 'error';
      break;
    case 'refund':
      status = 'refund';
      break;
    default:
      status = 'error';
      break;
  }
  return {
    id: raw.id,
    date: new Date(raw.created_at).toISOString(),
    contactFullName: `${raw.contact.first_name} ${raw.contact.last_name}`,
    contactId: raw.contact.id,
    productName: raw.product.name,
    productId: raw.product.id,
    mailId: raw.letter_id,
    price: raw.price,
    status,
    thumbnail: {
      uri: raw.product.thumbnail_src,
    },
  };
}

export async function getPremiumTransactions(): Promise<PremiumTransaction[]> {
  store.dispatch(startAction(EntityTypes.PremiumTransactions));
  const body = await fetchAuthenticated(
    url.resolve(
      API_URL,
      `user/${store.getState().user.user.id}/credit-transactions`
    )
  );
  if (body.status !== 'OK' || !body.data) {
    store.dispatch(stopAction(EntityTypes.PremiumTransactions));
    throw body;
  }
  const transactions = (body.data as RawPremiumTransaction[])
    .filter((raw) => raw.premium)
    .map((raw) => cleanPremiumTransaction(raw));
  store.dispatch(setPremiumTransactions(transactions));
  store.dispatch(stopAction(EntityTypes.PremiumTransactions));
  return transactions;
}

interface RawStripeTransaction {
  created_at: string;
  id: number;
  pack: {
    coins: number;
    id: number;
    img_path: string;
    name: string;
    price: number;
  };
  status: 'success';
  failed_reason: string | null;
}

function cleanStripeTransaction(raw: RawStripeTransaction): StripeTransaction {
  return {
    id: raw.id,
    date: new Date(raw.created_at).toISOString(),
    failedReason: raw.failed_reason,
    pack: {
      id: raw.pack.id,
      name: raw.pack.name,
      image: {
        uri: raw.pack.img_path,
      },
      price: raw.pack.price / 100,
      coins: raw.pack.coins,
    },
    status: raw.status,
  };
}

export async function getStripeTransactions(): Promise<StripeTransaction[]> {
  store.dispatch(startAction(EntityTypes.StripeTransactions));
  const body = await fetchAuthenticated(
    url.resolve(
      API_URL,
      `user/${store.getState().user.user.id}/stripe-transactions`
    )
  );
  if (body.status !== 'OK' || !body.data) {
    store.dispatch(stopAction(EntityTypes.StripeTransactions));
    throw body;
  }
  const transactions = (body.data as RawStripeTransaction[]).map((raw) =>
    cleanStripeTransaction(raw)
  );
  store.dispatch(setStripeTransactions(transactions));
  store.dispatch(stopAction(EntityTypes.StripeTransactions));
  console.log(transactions);
  return transactions;
}

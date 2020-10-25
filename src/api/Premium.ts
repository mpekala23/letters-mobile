/* eslint-disable camelcase */
import {
  setPremiumCategories,
  setPremiumPacks,
  setTransactions,
} from '@store/Premium/PremiumActions';
import { startAction, stopAction } from '@store/UI/UIActions';
import store from '@store';
import url from 'url';
import {
  Category,
  EntityTypes,
  PremiumPack,
  RawCategory,
  Transaction,
  TransactionStatus,
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

interface RawTransaction {
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

function cleanTransaction(raw: RawTransaction): Transaction {
  let status;
  switch (raw.status) {
    case 'completed':
      status = TransactionStatus.Completed;
      break;
    case 'error':
      status = TransactionStatus.Error;
      break;
    case 'refund':
      status = TransactionStatus.Refund;
      break;
    default:
      status = TransactionStatus.Error;
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

export async function getPremiumTransactions(): Promise<Transaction[]> {
  store.dispatch(startAction(EntityTypes.Transactions));
  const body = await fetchAuthenticated(
    url.resolve(
      API_URL,
      `user/${store.getState().user.user.id}/credit-transactions`
    )
  );
  if (body.status !== 'OK' || !body.data) {
    store.dispatch(stopAction(EntityTypes.Transactions));
    throw body;
  }
  const transactions = (body.data as RawTransaction[])
    .filter((raw) => raw.premium)
    .map((raw) => cleanTransaction(raw));
  store.dispatch(setTransactions(transactions));
  store.dispatch(stopAction(EntityTypes.Transactions));
  return transactions;
}

export async function getStripeTransactions(): Promise<any> {
  const body = await fetchAuthenticated(
    url.resolve(
      API_URL,
      `user/${store.getState().user.user.id}/stripe-transactions`
    )
  );
  return body;
}

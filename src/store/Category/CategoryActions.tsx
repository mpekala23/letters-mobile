import { Category, Image } from 'types';
import {
  SET_CATEGORIES,
  SET_DESIGN_IMAGE,
  CategoryActionTypes,
  SET_LAST_UPDATED,
} from './CategoryTypes';

export function setCategories(categories: Category[]): CategoryActionTypes {
  return {
    type: SET_CATEGORIES,
    payload: categories,
  };
}

export function setDesignImage(
  categoryId: number,
  subcategoryName: string,
  designId: number,
  image: Image
): CategoryActionTypes {
  return {
    type: SET_DESIGN_IMAGE,
    payload: { categoryId, subcategoryName, designId, image },
  };
}

export function setLastUpdated(date: string | null): CategoryActionTypes {
  return {
    type: SET_LAST_UPDATED,
    payload: date,
  };
}

import { Category, PostcardDesign } from 'types';
import {
  SET_CATEGORIES,
  ADD_CATEGORY,
  SET_CATEGORY,
  REMOVE_CATEGORY,
  SET_SUBCATEGORIES,
  ADD_SUBCATEGORY,
  SET_SUBCATEGORY,
  REMOVE_SUBCATEGORY,
  CategoryActionTypes,
  SET_LAST_UPDATED,
} from './CategoryTypes';

export function setCategories(categories: Category[]): CategoryActionTypes {
  return {
    type: SET_CATEGORIES,
    payload: categories,
  };
}

export function addCategory(category: Category): CategoryActionTypes {
  return {
    type: ADD_CATEGORY,
    payload: category,
  };
}

export function setCategory(category: Category): CategoryActionTypes {
  return {
    type: SET_CATEGORY,
    payload: category,
  };
}

export function removeCategory(category: Category): CategoryActionTypes {
  return {
    type: REMOVE_CATEGORY,
    payload: category,
  };
}

export function setSubcategories(
  categoryId: number,
  subcategories: Record<string, PostcardDesign[]>
): CategoryActionTypes {
  return {
    type: SET_SUBCATEGORIES,
    payload: { categoryId, subcategories },
  };
}

export function addSubcategory(
  categoryId: number,
  name: string,
  designs: PostcardDesign[]
): CategoryActionTypes {
  return {
    type: ADD_SUBCATEGORY,
    payload: { categoryId, name, designs },
  };
}

export function setSubcategory(
  categoryId: number,
  name: string,
  designs: PostcardDesign[]
): CategoryActionTypes {
  return {
    type: SET_SUBCATEGORY,
    payload: { categoryId, name, designs },
  };
}

export function removeSubcategory(
  categoryId: number,
  name: string
): CategoryActionTypes {
  return {
    type: REMOVE_SUBCATEGORY,
    payload: { categoryId, name },
  };
}

export function setLastUpdated(date: string | null): CategoryActionTypes {
  return {
    type: SET_LAST_UPDATED,
    payload: date,
  };
}

import { Category, PostcardDesign } from 'types';

export const SET_CATEGORIES = 'category/set_categories';
export const ADD_CATEGORY = 'category/add_category';
export const SET_CATEGORY = 'category/set_category';
export const REMOVE_CATEGORY = 'category/remove_category';

export const SET_SUBCATEGORIES = 'category/set_subcategories';
export const ADD_SUBCATEGORY = 'category/add_subcategory';
export const SET_SUBCATEGORY = 'category/set_subcategory';
export const REMOVE_SUBCATEGORY = 'category/remove_subcategory';

export const SET_LAST_UPDATED = 'cateogry/set_last_updated';

export interface CategoryState {
  categories: Category[];
  lastUpdated: Date;
}

interface SetCategoriesAction {
  type: typeof SET_CATEGORIES;
  payload: Category[];
}

interface AddCategoryAction {
  type: typeof ADD_CATEGORY;
  payload: Category;
}

interface SetCategoryAction {
  type: typeof SET_CATEGORY;
  payload: Category;
}

interface RemoveCategoryAction {
  type: typeof REMOVE_CATEGORY;
  payload: Category;
}

interface SetSubcategoriesAction {
  type: typeof SET_SUBCATEGORIES;
  payload: {
    categoryId: number;
    subcategories: Record<string, PostcardDesign[]>;
  };
}

interface AddSubcategoryAction {
  type: typeof ADD_SUBCATEGORY;
  payload: { categoryId: number; name: string; designs: PostcardDesign[] };
}

interface SetSubcategoryAction {
  type: typeof SET_SUBCATEGORY;
  payload: { categoryId: number; name: string; designs: PostcardDesign[] };
}

interface RemoveSubcategoryAction {
  type: typeof REMOVE_SUBCATEGORY;
  payload: { categoryId: number; name: string };
}

interface SetLastUpdatedAction {
  type: typeof SET_LAST_UPDATED;
  payload: Date;
}

export type CategoryActionTypes =
  | SetCategoriesAction
  | AddCategoryAction
  | SetCategoryAction
  | RemoveCategoryAction
  | SetSubcategoriesAction
  | AddSubcategoryAction
  | SetSubcategoryAction
  | RemoveSubcategoryAction
  | SetLastUpdatedAction;

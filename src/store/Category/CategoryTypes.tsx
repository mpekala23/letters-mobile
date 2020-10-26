import { Category, Image } from 'types';

export const SET_CATEGORIES = 'category/set_categories';

export const SET_DESIGN_IMAGE = 'category/set_design_image';

export const SET_LAST_UPDATED = 'cateogry/set_last_updated';

export interface CategoryState {
  categories: Category[];
  lastUpdated: string | null;
}

interface SetCategoriesAction {
  type: typeof SET_CATEGORIES;
  payload: Category[];
}

interface SetDesignImageAction {
  type: typeof SET_DESIGN_IMAGE;
  payload: {
    categoryId: number;
    subcategoryName: string;
    designId: number;
    image: Image;
  };
}

interface SetLastUpdatedAction {
  type: typeof SET_LAST_UPDATED;
  payload: string | null;
}

export type CategoryActionTypes =
  | SetCategoriesAction
  | SetDesignImageAction
  | SetLastUpdatedAction;

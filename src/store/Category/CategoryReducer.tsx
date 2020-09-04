import { Category } from 'types';
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
  CategoryState,
  SET_LAST_UPDATED,
} from './CategoryTypes';

const initialState: CategoryState = {
  categories: [],
  lastUpdated: null,
};

export default function CategoryReducer(
  state = initialState,
  action: CategoryActionTypes
): CategoryState {
  const currentState = { ...state };
  let ix = -1;
  let categories: Category[] = [];
  switch (action.type) {
    case SET_CATEGORIES:
      currentState.categories = action.payload;
      return currentState;
    case ADD_CATEGORY:
      categories = [...currentState.categories];
      categories.push(action.payload);
      return {
        ...currentState,
        categories,
      };
    case SET_CATEGORY:
      ix = currentState.categories.findIndex(
        (value: Category) => value.id === action.payload.id
      );
      if (ix < 0) return currentState;
      currentState.categories[ix] = action.payload;
      return currentState;
    case REMOVE_CATEGORY:
      categories = currentState.categories.filter(
        (value: Category) => value.id !== action.payload.id
      );
      return {
        ...currentState,
        categories,
      };
    case SET_SUBCATEGORIES:
      ix = currentState.categories.findIndex(
        (value: Category) => value.id === action.payload.categoryId
      );
      if (ix < 0) return currentState;
      currentState.categories[ix].subcategories = action.payload.subcategories;
      return currentState;
    case ADD_SUBCATEGORY:
      ix = currentState.categories.findIndex(
        (value: Category) => value.id === action.payload.categoryId
      );
      if (ix < 0) return currentState;
      currentState.categories[ix].subcategories[action.payload.name] =
        action.payload.designs;
      return currentState;
    case SET_SUBCATEGORY:
      ix = currentState.categories.findIndex(
        (value: Category) => value.id === action.payload.categoryId
      );
      if (ix < 0) return currentState;
      currentState.categories[ix].subcategories[action.payload.name] =
        action.payload.designs;
      return currentState;
    case REMOVE_SUBCATEGORY:
      categories = currentState.categories.filter(
        (value: Category) => value.id !== action.payload.categoryId
      );
      return {
        ...currentState,
        categories,
      };
    case SET_LAST_UPDATED:
      currentState.lastUpdated = action.payload;
      return currentState;
    default:
      return state;
  }
}

import { Category, PostcardDesign } from 'types';
import {
  SET_CATEGORIES,
  ADD_CATEGORY,
  SET_CATEGORY,
  REMOVE_CATEGORY,
  SET_SUBCATEGORIES,
  ADD_SUBCATEGORY,
  SET_SUBCATEGORY,
  SET_DESIGN_IMAGE,
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
  let jx = -1;
  let categories: Category[] = [];
  let newSubcategory: PostcardDesign[];
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
    case SET_DESIGN_IMAGE:
      ix = currentState.categories.findIndex(
        (value) => value.id === action.payload.categoryId
      );
      if (ix < 0) return currentState;
      if (
        !(
          action.payload.subcategoryName in
          currentState.categories[ix].subcategories
        )
      )
        return currentState;
      newSubcategory =
        currentState.categories[ix].subcategories[
          action.payload.subcategoryName
        ];
      jx = newSubcategory.findIndex(
        (design) => design.id === action.payload.designId
      );
      if (jx < 0) return currentState;
      newSubcategory[jx].image = action.payload.image;
      currentState.categories[ix].subcategories[
        action.payload.subcategoryName
      ] = [...newSubcategory];
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

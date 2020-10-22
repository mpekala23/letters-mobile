import { PremadeDesign } from 'types';
import {
  SET_CATEGORIES,
  SET_DESIGN_IMAGE,
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
  let newSubcategory: PremadeDesign[];
  switch (action.type) {
    case SET_CATEGORIES:
      currentState.categories = action.payload;
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
        (design) => 'id' in design && design.id === action.payload.designId
      );
      if (jx < 0) return currentState;
      newSubcategory[jx].image = action.payload.image;
      currentState.categories[ix].subcategories[
        action.payload.subcategoryName
      ] = [...newSubcategory];
      return currentState;
    case SET_LAST_UPDATED:
      currentState.lastUpdated = action.payload;
      return currentState;
    default:
      return state;
  }
}

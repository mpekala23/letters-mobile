import { LetterTypes, Letter, LetterStatus } from 'types';

export const SET_COMPOSING = 'letter/set_composing';
export const SET_ACTIVE = 'letter/set_active';
export const SET_TYPE = 'letter/set_type';
export const SET_STATUS = 'letter/set_status';
export const SET_DRAFT = 'letter/set_draft';
export const SET_RECIPIENT_ID = 'letter/set_recipient_id';
export const SET_MESSAGE = 'letter/set_message';
export const SET_PHOTO_PATH = 'letter/set_photo_path';
export const SET_LETTER_ID = 'letter/set_letter_id';
export const CLEAR_COMPOSING = 'letter/clear_composing';
export const SET_EXISTING = 'letter/set_existing';
export const ADD_LETTER = 'letter/add_letter';

export interface LetterState {
  composing: Letter;
  active: Letter | null;
  existing: Record<number, Letter[]>;
}

interface SetComposingAction {
  type: typeof SET_COMPOSING;
  payload: Letter;
}

interface SetActiveAction {
  type: typeof SET_ACTIVE;
  payload: Letter;
}

interface SetTypeAction {
  type: typeof SET_TYPE;
  payload: LetterTypes;
}

interface SetStatusAction {
  type: typeof SET_STATUS;
  payload: LetterStatus;
}

interface SetDraftAction {
  type: typeof SET_DRAFT;
  payload: boolean;
}

interface SetRecipientIdAction {
  type: typeof SET_RECIPIENT_ID;
  payload: number;
}

interface SetMessageAction {
  type: typeof SET_MESSAGE;
  payload: string;
}

interface SetPhotoPathAction {
  type: typeof SET_PHOTO_PATH;
  payload: string;
}

interface SetLetterIdAction {
  type: typeof SET_LETTER_ID;
  payload: number;
}

interface ClearComposingAction {
  type: typeof CLEAR_COMPOSING;
  payload: null;
}

interface SetExistingAction {
  type: typeof SET_EXISTING;
  payload: Record<number, Letter[]>;
}

interface AddLetterAction {
  type: typeof ADD_LETTER;
  payload: Letter;
}

export type LetterActionTypes =
  | SetComposingAction
  | SetTypeAction
  | SetStatusAction
  | SetDraftAction
  | SetRecipientIdAction
  | SetMessageAction
  | SetPhotoPathAction
  | SetLetterIdAction
  | ClearComposingAction
  | SetExistingAction
  | AddLetterAction
  | SetActiveAction;

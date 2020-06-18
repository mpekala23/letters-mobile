import { LetterTypes } from "types";
import { Contact } from "store/Contact/ContactTypes";

export const SET_COMPOSING = "letter/set_composing";
export const SET_TYPE = "letter/set_type";
export const SET_RECIPIENT = "letter/set_recipient";
export const SET_MESSAGE = "letter/set_message";
export const SET_PHOTO_PATH = "letter/set_photo_path";
export const CLEAR_COMPOSING = "letter/clear_composing";
export const SET_EXISTING = "letter/set_existing";

export interface Letter {
  type: LetterTypes;
  recipient: Contact | null;
  message: string;
  photoPath?: string;
}

export interface LetterState {
  composing: Letter;
  existing: Letter[];
}

interface SetComposingAction {
  type: typeof SET_COMPOSING;
  payload: Letter;
}

interface SetTypeAction {
  type: typeof SET_TYPE;
  payload: LetterTypes;
}

interface SetRecipientAction {
  type: typeof SET_RECIPIENT;
  payload: Contact;
}

interface SetMessageAction {
  type: typeof SET_MESSAGE;
  payload: string;
}

interface SetPhotoPathAction {
  type: typeof SET_PHOTO_PATH;
  payload: string;
}

interface ClearComposingAction {
  type: typeof CLEAR_COMPOSING;
  payload: null;
}

interface SetExistingAction {
  type: typeof SET_EXISTING;
  payload: Letter[];
}

export type LetterActionTypes =
  | SetComposingAction
  | SetTypeAction
  | SetRecipientAction
  | SetMessageAction
  | SetPhotoPathAction
  | ClearComposingAction
  | SetExistingAction;

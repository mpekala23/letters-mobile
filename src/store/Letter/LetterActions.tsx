import {
  Letter,
  SET_COMPOSING,
  SET_TYPE,
  SET_RECIPIENT,
  SET_MESSAGE,
  SET_PHOTO_PATH,
  CLEAR_COMPOSING,
  SET_EXISTING,
  LetterActionTypes,
} from "./LetterTypes";
import { Contact } from "store/Contact/ContactTypes";
import { LetterTypes } from "types";

export function setComposing(letter: Letter): LetterActionTypes {
  return {
    type: SET_COMPOSING,
    payload: letter,
  };
}

export function setType(letterType: LetterTypes): LetterActionTypes {
  return {
    type: SET_TYPE,
    payload: letterType,
  };
}

export function setRecipient(contact: Contact): LetterActionTypes {
  return {
    type: SET_RECIPIENT,
    payload: contact,
  };
}

export function setMessage(message: string): LetterActionTypes {
  return {
    type: SET_MESSAGE,
    payload: message,
  };
}

export function setPhotoPath(path: string): LetterActionTypes {
  return {
    type: SET_PHOTO_PATH,
    payload: path,
  };
}

export function clearComposing(): LetterActionTypes {
  return {
    type: CLEAR_COMPOSING,
    payload: null,
  };
}

export function setExisting(letters: Letter[]): LetterActionTypes {
  return {
    type: SET_EXISTING,
    payload: letters,
  };
}

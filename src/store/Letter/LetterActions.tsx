import { LetterTypes, Letter, LetterStatus } from 'types';
import {
  SET_COMPOSING,
  SET_ACTIVE,
  SET_TYPE,
  SET_STATUS,
  SET_DRAFT,
  SET_RECIPIENT_ID,
  SET_CONTENT,
  SET_PHOTO_PATH,
  SET_LETTER_ID,
  CLEAR_COMPOSING,
  SET_EXISTING,
  LetterActionTypes,
  ADD_LETTER,
} from './LetterTypes';

export function setComposing(letter: Letter): LetterActionTypes {
  return {
    type: SET_COMPOSING,
    payload: letter,
  };
}

export function setActive(letter: Letter): LetterActionTypes {
  return {
    type: SET_ACTIVE,
    payload: letter,
  };
}

export function setType(letterType: LetterTypes): LetterActionTypes {
  return {
    type: SET_TYPE,
    payload: letterType,
  };
}

export function setStatus(status: LetterStatus): LetterActionTypes {
  return {
    type: SET_STATUS,
    payload: status,
  };
}

export function setDraft(draft: boolean): LetterActionTypes {
  return {
    type: SET_DRAFT,
    payload: draft,
  };
}

export function setRecipientId(contactId: number): LetterActionTypes {
  return {
    type: SET_RECIPIENT_ID,
    payload: contactId,
  };
}

export function setContent(content: string): LetterActionTypes {
  return {
    type: SET_CONTENT,
    payload: content,
  };
}

export function setPhotoPath(path: string): LetterActionTypes {
  return {
    type: SET_PHOTO_PATH,
    payload: path,
  };
}

export function setLetterId(newId: number): LetterActionTypes {
  return {
    type: SET_LETTER_ID,
    payload: newId,
  };
}

export function clearComposing(): LetterActionTypes {
  return {
    type: CLEAR_COMPOSING,
    payload: null,
  };
}

export function setExisting(
  letters: Record<number, Letter[]>
): LetterActionTypes {
  return {
    type: SET_EXISTING,
    payload: letters,
  };
}

export function addLetter(letter: Letter): LetterActionTypes {
  return {
    type: ADD_LETTER,
    payload: letter,
  };
}

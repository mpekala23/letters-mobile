import { Draft, Mail, MailStatus, Image, PostcardDesign } from 'types';
import {
  SET_COMPOSING,
  SET_RECIPIENT_ID,
  SET_CONTENT,
  SET_IMAGES,
  SET_DESIGN,
  CLEAR_COMPOSING,
  ADD_MAIL,
  SET_ACTIVE,
  SET_STATUS,
  SET_DATE_CREATED,
  SET_EXPECTED_DELIVERY,
  SET_CONTACTS_MAIL,
  SET_EXISTING_MAIL,
  MailActionTypes,
} from './MailTypes';

export function setComposing(draft: Draft): MailActionTypes {
  return {
    type: SET_COMPOSING,
    payload: draft,
  };
}

export function setRecipientId(id: number): MailActionTypes {
  return {
    type: SET_RECIPIENT_ID,
    payload: id,
  };
}

export function setContent(content: string): MailActionTypes {
  return {
    type: SET_CONTENT,
    payload: content,
  };
}

export function setImages(images: Image[]): MailActionTypes {
  return {
    type: SET_IMAGES,
    payload: images,
  };
}

export function setDesign(design: PostcardDesign): MailActionTypes {
  return {
    type: SET_DESIGN,
    payload: design,
  };
}

export function clearComposing(): MailActionTypes {
  return {
    type: CLEAR_COMPOSING,
    payload: null,
  };
}

export function addMail(mail: Mail): MailActionTypes {
  return {
    type: ADD_MAIL,
    payload: mail,
  };
}

export function setActive(mail: Mail | null): MailActionTypes {
  return {
    type: SET_ACTIVE,
    payload: mail,
  };
}

export function setStatus(
  status: MailStatus,
  contactId: number,
  mailId: number
): MailActionTypes {
  return {
    type: SET_STATUS,
    payload: {
      contactId,
      mailId,
      status,
    },
  };
}

export function setDateCreated(
  dateCreated: Date,
  contactId: number,
  mailId: number
): MailActionTypes {
  return {
    type: SET_DATE_CREATED,
    payload: {
      contactId,
      mailId,
      dateCreated,
    },
  };
}

export function setExpectedDelivery(
  expectedDelivery: Date,
  contactId: number,
  mailId: number
): MailActionTypes {
  return {
    type: SET_EXPECTED_DELIVERY,
    payload: {
      contactId,
      mailId,
      expectedDelivery,
    },
  };
}

export function setContactsMail(
  contactId: number,
  mail: Mail[]
): MailActionTypes {
  return {
    type: SET_CONTACTS_MAIL,
    payload: {
      contactId,
      mail,
    },
  };
}

export function setExistingMail(mail: Record<string, Mail[]>): MailActionTypes {
  return {
    type: SET_EXISTING_MAIL,
    payload: mail,
  };
}

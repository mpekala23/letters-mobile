import { Draft, Mail, MailStatus, Image, PostcardDesign } from 'types';

// Draft actions
export const SET_COMPOSING = 'mail/set_composing';
export const SET_RECIPIENT_ID = 'mail/set_recipient_id';
export const SET_CONTENT = 'mail/set_content';
export const SET_IMAGES = 'mail/set_images';
export const SET_DESIGN = 'mail/set_design';
export const CLEAR_COMPOSING = 'mail/clear_composing';

export interface MailState {
  composing: Draft;
  active: Mail | null;
  existing: Record<string, Mail[]>;
}

interface SetComposingAction {
  type: typeof SET_COMPOSING;
  payload: Draft;
}

interface SetRecipientIdAction {
  type: typeof SET_RECIPIENT_ID;
  payload: number;
}

interface SetContentAction {
  type: typeof SET_CONTENT;
  payload: string;
}

interface SetImagesAction {
  type: typeof SET_IMAGES;
  payload: Image[];
}

interface SetDesignAction {
  type: typeof SET_DESIGN;
  payload: PostcardDesign;
}

interface ClearComposingAction {
  type: typeof CLEAR_COMPOSING;
  payload: null;
}

// Mail actions
export const ADD_MAIL = 'mail/add_mail';
export const SET_ACTIVE = 'mail/set_active';
export const SET_STATUS = 'mail/set_status';
export const SET_DATE_CREATED = 'mail/set_date_created';
export const SET_EXPECTED_DELIVERY = 'mail/set_expected_delivery';
export const SET_CONTACTS_MAIL = 'mail/set_contacts_mail';
export const SET_EXISTING_MAIL = 'mail/set_existing_mail';

interface AddMailAction {
  type: typeof ADD_MAIL;
  payload: Mail;
}

interface SetActiveAction {
  type: typeof SET_ACTIVE;
  payload: Mail;
}

interface SetStatusAction {
  type: typeof SET_STATUS;
  payload: {
    contactId: number;
    mailId: number;
    status: MailStatus;
  };
}

interface SetDateCreatedAction {
  type: typeof SET_DATE_CREATED;
  payload: {
    contactId: number;
    mailId: number;
    dateCreated: Date;
  };
}

interface SetExpectedDeliveryAction {
  type: typeof SET_EXPECTED_DELIVERY;
  payload: {
    contactId: number;
    mailId: number;
    expectedDelivery: Date;
  };
}

interface SetContactsMailAction {
  type: typeof SET_CONTACTS_MAIL;
  payload: {
    contactId: number;
    mail: Mail[];
  };
}

interface SetExistingMailAction {
  type: typeof SET_EXISTING_MAIL;
  payload: Record<string, Mail[]>;
}

export type MailActionTypes =
  | SetComposingAction
  | SetRecipientIdAction
  | SetContentAction
  | SetImagesAction
  | SetDesignAction
  | ClearComposingAction
  | AddMailAction
  | SetActiveAction
  | SetStatusAction
  | SetDateCreatedAction
  | SetExpectedDeliveryAction
  | SetContactsMailAction
  | SetExistingMailAction;

import { getZipcode } from './Common';

import {
  addContact,
  updateContact,
  deleteContact,
  getContact,
  getContacts,
} from './Contacts';

import { getFacility, getFacilities } from './Facilities';

import {
  createMail,
  getMail,
  getSingleMail,
  getTrackingEvents,
  getCategories,
  getSubcategories,
} from './Mail';

import {
  register,
  login,
  loginWithToken,
  logout,
  updateProfile,
  getUser,
  uploadPushToken,
  saveDraft,
  deleteDraft,
  loadDraft,
} from './User';

export {
  uploadPushToken,
  getZipcode,
  addContact,
  updateContact,
  deleteContact,
  getContact,
  getContacts,
  getFacility,
  getFacilities,
  createMail,
  getMail,
  getSingleMail,
  getTrackingEvents,
  getCategories,
  register,
  login,
  loginWithToken,
  logout,
  updateProfile,
  getUser,
  saveDraft,
  deleteDraft,
  loadDraft,
  getSubcategories,
};

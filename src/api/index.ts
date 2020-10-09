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
  getMailByContact,
  initMail,
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
  getUserReferrals,
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
  getMailByContact,
  createMail,
  getMail,
  initMail,
  getSingleMail,
  getTrackingEvents,
  getCategories,
  register,
  login,
  loginWithToken,
  logout,
  updateProfile,
  getUser,
  getUserReferrals,
  saveDraft,
  deleteDraft,
  loadDraft,
};

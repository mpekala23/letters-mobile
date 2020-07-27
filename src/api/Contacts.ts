/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
// The above is necessary because a lot of the responses from the server are forced snake case on us
import store from '@store';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import url from 'url';
import { PrisonTypes } from 'types';
import {
  setAdding as setAddingContact,
  setExisting as setExistingContacts,
  setActive as setActiveContact,
} from '@store/Contact/ContactActions';
import { Contact } from '@store/Contact/ContactTypes';
import i18n from '@i18n';
import { STATE_TO_ABBREV, ABBREV_TO_STATE } from '@utils';
import { fetchAuthenticated, API_URL, uploadImage } from './Common';

interface RawContact {
  id: number;
  state: string;
  first_name: string;
  last_name: string;
  facility_state: string;
  inmate_number: string;
  relationship: string;
  facility_name: string;
  facility_address: string;
  facility_city: string;
  facility_postal: string;
  dorm: string;
  unit: string;
  s3_img_url?: string;
  profile_img_path?: string;
}

function cleanContact(data: RawContact): Contact {
  const dormExtension = data.dorm ? { dorm: data.dorm } : {};
  const unitExtension = data.unit ? { unit: data.unit } : {};
  const photoExtension =
    data.s3_img_url || data.profile_img_path
      ? {
          photo: {
            type: 'image/jpeg',
            uri: data.s3_img_url || data.profile_img_path || '',
          },
        }
      : {};
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    inmateNumber: data.inmate_number,
    relationship: data.relationship,
    facility: {
      name: data.facility_name,
      type: PrisonTypes.Federal, // TODO: once this is supported on the backend, update this field
      address: data.facility_address,
      city: data.facility_city,
      state: ABBREV_TO_STATE[data.facility_state],
      postal: data.facility_postal,
    },
    ...dormExtension,
    ...unitExtension,
    ...photoExtension,
  };
}

export async function getContacts(page = 1): Promise<Contact[]> {
  const params = new URLSearchParams({ page: page.toString() });
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `contacts?${params}`),
    {
      method: 'GET',
    }
  );
  const data = body.data as { data: RawContact[] };
  if (body.status !== 'OK' || !data || !data.data) throw body;
  const existingContacts = data.data.map((contact: RawContact) =>
    cleanContact(contact)
  );
  store.dispatch(setExistingContacts(existingContacts));
  return existingContacts;
}

export async function getContact(id: number): Promise<Contact> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `contact/${id}`), {
    method: 'GET',
  });
  if (body.status !== 'OK' || !body.data) throw body;
  return cleanContact(body.data as RawContact);
}

export async function addContact(contactData: Contact): Promise<Contact[]> {
  if (!contactData.facility) throw Error('No facility');
  const dormExtension = contactData.dorm
    ? { facility_dorm: contactData.dorm }
    : {};
  const unitExtension = contactData.unit
    ? { facility_unit: contactData.unit }
    : {};
  let photoExtension = {};
  let newPhoto;
  if (contactData.photo) {
    try {
      newPhoto = await uploadImage(contactData.photo, 'avatar');
      photoExtension = { s3_img_url: newPhoto.uri };
    } catch (err) {
      dropdownError({ message: i18n.t('Error.unableToUploadProfilePicture') });
    }
  }
  const body = await fetchAuthenticated(url.resolve(API_URL, 'contact'), {
    method: 'POST',
    body: JSON.stringify({
      first_name: contactData.firstName,
      last_name: contactData.lastName,
      inmate_number: contactData.inmateNumber,
      facility_name: contactData.facility.name,
      facility_address: contactData.facility.address,
      facility_city: contactData.facility.city,
      facility_state: STATE_TO_ABBREV[contactData.facility.state],
      facility_postal: contactData.facility.postal,
      ...dormExtension,
      ...unitExtension,
      ...photoExtension,
      relationship: contactData.relationship,
    }),
  });
  if (body.status !== 'OK') throw body;
  const data = body.data as RawContact;
  const newContact = cleanContact(data);
  const { existing } = store.getState().contact;
  existing.unshift(newContact);
  store.dispatch(setExistingContacts(existing));
  store.dispatch(
    setAddingContact({
      id: -1,
      firstName: '',
      lastName: '',
      inmateNumber: '',
      relationship: '',
      facility: null,
    })
  );
  return existing;
}

export async function updateContact(data: Contact): Promise<Contact[]> {
  if (!data.facility) throw Error('No facility');
  let newPhoto = data.photo ? { ...data.photo } : undefined;
  const existingPhoto = store.getState().contact.active.photo;
  if (
    newPhoto &&
    ((existingPhoto && newPhoto.uri !== existingPhoto.uri) || !existingPhoto)
  ) {
    // there is a new photo and it is different from the existing photo (or there is no existing photo)
    try {
      newPhoto = await uploadImage(newPhoto, 'avatar');
    } catch (err) {
      newPhoto = undefined;
      dropdownError({ message: 'Error.unableToUploadContactPicture' });
    }
  }
  const dormExtension = data.dorm ? { facility_dorm: data.dorm } : {};
  const unitExtension = data.unit ? { facility_unit: data.unit } : {};
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `contact/${data.id}`),
    {
      method: 'PUT',
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        inmate_number: data.inmateNumber,
        facility_name: data.facility.name,
        facility_address: data.facility.address,
        facility_city: data.facility.city,
        facility_state: STATE_TO_ABBREV[data.facility.state],
        facility_postal: data.facility.postal,
        ...dormExtension,
        ...unitExtension,
        s3_img_url: newPhoto?.uri,
        relationship: data.relationship,
      }),
    }
  );
  if (body.status === 'ERROR') throw body.data;
  const updatedContact = { ...data };
  updatedContact.photo = newPhoto;
  const { existing } = store.getState().contact;
  const newExisting = [];
  for (let ix = 0; ix < existing.length; ix += 1) {
    if (existing[ix].id === updatedContact.id) {
      newExisting.push(updatedContact);
    } else {
      newExisting.push(existing[ix]);
    }
  }
  store.dispatch(setExistingContacts(newExisting));
  store.dispatch(setActiveContact(updatedContact));
  return newExisting;
}

export async function deleteContact(id: number): Promise<Contact[]> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `contact/${id}`), {
    method: 'DELETE',
  });
  if (body.status === 'ERROR') throw body;
  const { existing } = store.getState().contact;
  const newExisting = existing.filter((contact) => contact.id !== id);
  store.dispatch(setExistingContacts(newExisting));
  return newExisting;
}

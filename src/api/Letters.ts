/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
// The above is necessary because a lot of the responses from the server are forced snake case on us
import store from '@store';
import { Linking } from 'react-native';
import url from 'url';
import { Letter, LetterTrackingEvent, LetterTypes, LetterStatus } from 'types';
import {
  addLetter,
  setExisting as setExistingLetters,
} from '@store/Letter/LetterActions';
import { setUser } from '@store/User/UserActions';
import { popupAlert } from '@components/Alert/Alert.react';
import i18n from '@i18n';
import {
  differenceInDays,
  addBusinessDays,
  differenceInBusinessDays,
} from 'date-fns';
import {
  getZipcode,
  fetchAuthenticated,
  API_URL,
  uploadImage,
  ApiResponse,
} from './Common';

interface RawTrackingEvent {
  id: number;
  name: string;
  date: string;
  location: string;
}

interface RawImage {
  id: number;
  letter_id: number;
  created_at: string;
  updated_at: string;
  img_src: string;
}

interface RawLetter {
  id: number;
  created_at: string;
  contact_id: number;
  content: string;
  sent: boolean;
  delivered: boolean;
  images: RawImage[];
  type: LetterTypes;
  lob_status: string;
  last_lob_status_update: string;
  tracking_events?: RawTrackingEvent[];
}

async function cleanTrackingEvent(
  event: RawTrackingEvent
): Promise<LetterTrackingEvent> {
  const location = await getZipcode(event.location);
  return {
    id: event.id,
    name: event.name,
    location,
    date: new Date(event.date),
  };
}

function cleanLobStatus(status: string, date: Date): LetterStatus {
  if (!status) return LetterStatus.Created;
  const event = status.split('.')[1];
  if (event === 'in_transit') return LetterStatus.InTransit;
  if (event === 'processed_for_delivery') {
    if (!date) return LetterStatus.Delivered;
    if (differenceInBusinessDays(date, new Date()) <= 3)
      return LetterStatus.OutForDelivery;
    return LetterStatus.Delivered;
  }
  if (event === 'in_local_area') return LetterStatus.InLocalArea;
  if (event === 'mailed') return LetterStatus.Mailed;
  return LetterStatus.Created;
}

// cleans a letter returned as part of an array for all a user's letters
async function cleanMassLetter(letter: RawLetter): Promise<Letter> {
  if (!letter.lob_status || !letter.last_lob_status_update) {
    return getSingleLetter(letter.id);
  }
  const { type, content } = letter;
  const recipientId = letter.contact_id;
  const photo =
    letter.images.length > 0
      ? {
          type: 'image/jpeg',
          uri: letter.images[0].img_src,
        }
      : undefined;
  const letterId = letter.id;
  const dateCreated = new Date(letter.created_at);
  const lastLobUpdate = new Date(letter.last_lob_status_update);
  const lobStatus = letter.lob_status;
  let status: LetterStatus;
  let isDraft: boolean;
  if (!letter.sent) {
    status = LetterStatus.Draft;
    isDraft = true;
  } else {
    status = cleanLobStatus(letter.lob_status, lastLobUpdate);
    isDraft = false;
  }
  let expectedDeliveryDate = addBusinessDays(new Date(letter.created_at), 6);
  if (status === LetterStatus.OutForDelivery) {
    expectedDeliveryDate = addBusinessDays(lastLobUpdate, 3);
  }
  return {
    type,
    status,
    isDraft,
    recipientId,
    content,
    photo,
    letterId,
    expectedDeliveryDate,
    dateCreated,
    lobStatus,
    lastLobUpdate,
  };
}

async function cleanLetter(letter: RawLetter): Promise<Letter> {
  const { type } = letter;
  let status: LetterStatus;
  let expectedDeliveryDate = addBusinessDays(new Date(letter.created_at), 6);
  const trackingEvents = !letter.tracking_events
    ? []
    : await Promise.all(
        letter.tracking_events.map((rawEvent) => cleanTrackingEvent(rawEvent))
      );
  if (!letter.sent) {
    status = LetterStatus.Draft;
  } else {
    let inTransit = false;
    let processedForDelivery = false;
    let processedForDeliveryDate = new Date();
    for (let ix = 0; ix < trackingEvents.length; ix += 1) {
      inTransit = inTransit || trackingEvents[ix].name === 'In Transit';
      processedForDelivery =
        processedForDelivery ||
        trackingEvents[ix].name === 'Processed for Delivery';
      if (trackingEvents[ix].name === 'Processed for Delivery') {
        processedForDeliveryDate = trackingEvents[ix].date;
      }
    }
    if (!inTransit) {
      status = LetterStatus.Created;
    } else if (!processedForDelivery) {
      status = LetterStatus.Mailed;
    } else {
      expectedDeliveryDate = addBusinessDays(processedForDeliveryDate, 3);
      const dayDiff = differenceInDays(processedForDeliveryDate, new Date());
      if (dayDiff <= 5) {
        status = LetterStatus.OutForDelivery;
      } else {
        status = LetterStatus.Delivered;
      }
    }
  }
  const isDraft = !letter.sent;
  const recipientId: number = letter.contact_id;
  const { content } = letter;
  const photo = {
    type: 'image/jpeg',
    uri: letter.images.length !== 0 ? letter.images[0].img_src : '',
  };
  const letterId = letter.id;
  const dateCreated = new Date(letter.created_at);
  const lastLobUpdate = new Date(letter.last_lob_status_update);
  const lobStatus = cleanLobStatus(letter.lob_status, lastLobUpdate);
  return {
    type,
    status,
    isDraft,
    recipientId,
    content,
    photo,
    letterId,
    expectedDeliveryDate,
    dateCreated,
    lobStatus,
    lastLobUpdate,
    trackingEvents,
  };
}

export async function getLetters(page = 1): Promise<Record<number, Letter[]>> {
  const params = new URLSearchParams({ page: page.toString() });
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `letters?${params}`),
    {
      method: 'GET',
    }
  );
  const data = body.data as { current_page: number; data: RawLetter[] };
  if (body.status !== 'OK' || !data || !data.data) throw body;

  /*
  const newExisting: Record<number, Letter> = {};
  for (let ix = 0; ix < data.data.length; ix += 1) {
    const raw = data.data[ix];
    const clean = await cleanMassLetter(raw);
    if (clean.letterId in newExisting) {
      existingLetters[clean.recipientId].push(clean);
    } else {
      existingLetters[clean.recipientId] = [clean];
    }
  } */

  const existingLetters: Record<number, Letter[]> = {};
  for (let ix = 0; ix < data.data.length; ix += 1) {
    const rawLetter = data.data[ix];
    if (rawLetter.contact_id in existingLetters) {
      existingLetters[rawLetter.contact_id].push(await cleanLetter(rawLetter));
    } else {
      existingLetters[rawLetter.contact_id] = [await cleanLetter(rawLetter)];
    }
  }

  store.dispatch(setExistingLetters(existingLetters));
  return existingLetters;
}

export async function createLetter(letter: Letter): Promise<Letter> {
  const { user } = store.getState().user;
  if (user.credit <= 0) {
    popupAlert({
      title: i18n.t('Compose.notEnoughCredits'),
      buttons: [{ text: i18n.t('Alert.okay') }],
    });
  }
  const createdLetter = { ...letter };
  let imageExtension = {};
  if (createdLetter.photo) {
    try {
      createdLetter.photo = await uploadImage(createdLetter.photo, 'letter');
      imageExtension = {
        s3_img_urls: [createdLetter.photo.uri],
      };
    } catch (err) {
      const uploadError: ApiResponse = {
        status: 'ERROR',
        message: 'Unable to upload image.',
        date: Date.now(),
        data: {},
      };
      throw uploadError;
    }
  }
  const letterExtension = createdLetter.letterId
    ? { letter_id: createdLetter.letterId }
    : {};
  const reqBody: Record<string, unknown> = {
    contact_id: createdLetter.recipientId,
    content: createdLetter.content,
    is_draft: createdLetter.isDraft,
    type: createdLetter.type,
    size: createdLetter.type === LetterTypes.Postcard ? '4x6' : undefined,
    ...imageExtension,
    ...letterExtension,
  };
  const body = await fetchAuthenticated(url.resolve(API_URL, 'letter'), {
    method: 'POST',
    body: JSON.stringify(reqBody),
  });
  if (body.status !== 'OK' || !body.data) throw body;
  const data = body.data as RawLetter;
  createdLetter.letterId = data.id;
  createdLetter.dateCreated = new Date(data.created_at);
  store.dispatch(addLetter(createdLetter));
  user.credit -= 1;
  store.dispatch(setUser(user));
  return createdLetter;
}

export async function facebookShare(shareUrl: string): Promise<void> {
  const supportedUrl = await Linking.canOpenURL(shareUrl);
  if (supportedUrl) {
    await Linking.openURL(shareUrl);
  } else {
    throw Error('Share Url not supported');
  }
}

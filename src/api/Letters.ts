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

async function cleanLetter(letter: RawLetter): Promise<Letter> {
  const { type } = letter;
  let status: LetterStatus;
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
    let processedForDeliveryDate = new Date(Date.now());
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
      const now = new Date(Date.now());
      const timeDiff = now.getTime() - processedForDeliveryDate.getTime();
      const dayDiff = timeDiff / (1000 * 3600 * 24);
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
  const expectedDeliveryDate = letter.created_at;
  const dateCreated = letter.created_at;
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
    ...imageExtension,
    ...letterExtension,
  };

  const body = await fetchAuthenticated(url.resolve(API_URL, 'letter'), {
    method: 'POST',
    body: JSON.stringify(reqBody),
  });
  if (body.status !== 'OK' || !body.data) throw body;
  // TODO: Figure out how letter_id is returned from actual API and update it here
  store.dispatch(addLetter(createdLetter));
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

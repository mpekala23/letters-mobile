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
  setActive,
} from '@store/Letter/LetterActions';
import { setUser } from '@store/User/UserActions';
import { popupAlert } from '@components/Alert/Alert.react';
import i18n from '@i18n';
import { addBusinessDays, differenceInBusinessDays } from 'date-fns';
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
  date_modified: string;
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
  images: RawImage[];
  type: LetterTypes;
  lob_status: string;
  last_lob_status_update: string;
  tracking_events?: RawTrackingEvent[];
}

async function cleanTrackingEvent(
  event: RawTrackingEvent
): Promise<LetterTrackingEvent> {
  const location = event.location
    ? await getZipcode(event.location)
    : undefined;
  return {
    id: event.id,
    name: event.name,
    location,
    date: new Date(event.date_modified),
  };
}

function cleanLobStatus(status: string, date: Date): LetterStatus {
  if (!status) return LetterStatus.Created;
  if (status.includes('in_transit')) return LetterStatus.InTransit;
  if (status.includes('processed_for_delivery')) {
    if (!date) return LetterStatus.ProcessedForDelivery;
    if (Math.abs(differenceInBusinessDays(date, new Date())) <= 3)
      return LetterStatus.ProcessedForDelivery;
    return LetterStatus.Delivered;
  }
  if (status.includes('in_local_area')) return LetterStatus.InLocalArea;
  if (status.includes('mailed')) return LetterStatus.Mailed;
  if (status.includes('returned_to_sender'))
    return LetterStatus.ReturnedToSender;
  return LetterStatus.Created;
}

export function mapTrackingEventsToLetterStatus(
  events: LetterTrackingEvent[]
): LetterStatus {
  if (!events.length) return LetterStatus.Created;
  const lastIdx = events.length - 1;
  let letterStatus = events[lastIdx].name as LetterStatus;
  if (
    events[lastIdx].name === LetterStatus.ProcessedForDelivery &&
    differenceInBusinessDays(new Date(), events[lastIdx].date) > 3
  ) {
    letterStatus = LetterStatus.Delivered;
  }
  return letterStatus;
}

// cleans a letter returned from getSingleLetter
async function cleanLetter(letter: RawLetter): Promise<Letter> {
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
  const isDraft = !letter.sent;
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
    status = mapTrackingEventsToLetterStatus(trackingEvents);
    if (status === LetterStatus.ProcessedForDelivery) {
      expectedDeliveryDate = addBusinessDays(
        trackingEvents[trackingEvents.length - 1].date,
        3
      );
    }
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
    trackingEvents,
  };
}

export async function getSingleLetter(id: number | undefined): Promise<Letter> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `letter/${id}`), {
    method: 'GET',
  });
  const data = body.data as RawLetter;
  if (body.status !== 'OK' || !data) throw body;
  const cleanedLetter = await cleanLetter(data);
  return cleanedLetter;
}

// cleans a letter returned from getLetters and defaults to getSingleLetter if necessary
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
  if (status === LetterStatus.ProcessedForDelivery) {
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
  const newExisting: Record<number, Letter[]> = {};
  await Promise.all(
    data.data.map(async (raw) => {
      const clean = await cleanMassLetter(raw);
      if (clean.recipientId in newExisting) {
        const letters = newExisting[clean.recipientId];
        let ix = 0;
        for (ix = 0; ix < letters.length; ix += 1) {
          const searchDate = letters[ix].dateCreated;
          if (clean.dateCreated && searchDate && clean.dateCreated > searchDate)
            break;
        }
        letters.splice(ix, 0, clean);
        newExisting[clean.recipientId] = letters;
      } else {
        newExisting[clean.recipientId] = [clean];
      }
    })
  );
  store.dispatch(setExistingLetters(newExisting));
  return newExisting;
}

export async function getTrackingEvents(
  id: number | undefined
): Promise<Letter> {
  const letter = await getSingleLetter(id);
  store.dispatch(setActive(letter));
  return letter;
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

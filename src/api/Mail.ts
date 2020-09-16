/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
// The above is necessary because a lot of the responses from the server are forced snake case on us
import store from '@store';
import url from 'url';
import {
  Draft,
  Mail,
  TrackingEvent,
  MailTypes,
  MailStatus,
  Category,
  PostcardDesign,
  Image,
} from 'types';
import { addMail, setExistingMail, setActive } from '@store/Mail/MailActions';
import { setUser } from '@store/User/UserActions';
import { popupAlert } from '@components/Alert/Alert.react';
import i18n from '@i18n';
import { addBusinessDays } from 'date-fns';
import { estimateDelivery, getImageDims } from '@utils';

import { setCategories, setLastUpdated } from '@store/Category/CategoryActions';
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

interface RawMail {
  id: number;
  created_at: string;
  contact_id: number;
  content: string;
  sent: boolean;
  images: RawImage[];
  type: MailTypes;
  lob_status: string;
  last_lob_status_update: string;
  tracking_events?: RawTrackingEvent[];
  estimated_arrival: string;
  delivered: boolean;
}

function cleanLobStatus(status: string): MailStatus {
  // e.g 'In Transit' (single mail tracking event) and 'postcard.in_transit' (mail status)
  const normalizedStatus = status.split(' ').join('_').toLowerCase();
  if (!normalizedStatus) return MailStatus.Created;
  if (normalizedStatus.includes('in_transit')) return MailStatus.InTransit;
  if (normalizedStatus.includes('processed_for_delivery')) {
    return MailStatus.ProcessedForDelivery;
  }
  if (normalizedStatus.includes('in_local_area')) return MailStatus.InLocalArea;
  if (normalizedStatus.includes('mailed')) return MailStatus.Mailed;
  if (normalizedStatus.includes('returned_to_sender'))
    return MailStatus.ReturnedToSender;
  return MailStatus.Created;
}

async function cleanTrackingEvent(
  event: RawTrackingEvent
): Promise<TrackingEvent> {
  const location = event.location
    ? await getZipcode(event.location)
    : undefined;
  const date = new Date(event.date_modified);

  return {
    id: event.id,
    name: cleanLobStatus(event.name),
    location,
    date: new Date(date),
  };
}

export function mapTrackingEventsToMailStatus(
  events: TrackingEvent[]
): MailStatus {
  if (!events.length) return MailStatus.Created;
  const lastIdx = events.length - 1;
  return cleanLobStatus(events[lastIdx].name);
}

// cleans mail returned from getSingleMail
async function cleanMail(mail: RawMail): Promise<Mail> {
  const { type, content, id } = mail;
  const recipientId = mail.contact_id;
  let images: Image[] = [];
  if (mail.images.length) {
    try {
      images = await Promise.all(
        mail.images.map(async (rawImage) => {
          const dimensions = await getImageDims(rawImage.img_src);
          return {
            uri: rawImage.img_src,
            ...dimensions,
          };
        })
      );
    } catch {
      images = mail.images.map((rawImage) => ({ uri: rawImage.img_src }));
    }
  }
  let design = { image: { uri: '' } };
  if (mail.images.length) {
    try {
      const dimensions = await getImageDims(mail.images[0].img_src);
      design = {
        image: {
          uri: mail.images[0].img_src,
          ...dimensions,
        },
      };
    } catch {
      design = { image: { uri: mail.images[0].img_src } };
    }
  }

  const dateCreated = new Date(mail.created_at);
  let status: MailStatus;
  let expectedDelivery = addBusinessDays(new Date(mail.created_at), 6);

  const trackingEvents = !mail.tracking_events
    ? []
    : await Promise.all(
        mail.tracking_events.map((rawEvent) => cleanTrackingEvent(rawEvent))
      );
  if (!mail.sent) {
    status = MailStatus.Draft;
  } else if (mail.delivered) {
    status = MailStatus.Delivered;
  } else {
    status = mapTrackingEventsToMailStatus(trackingEvents);
    if (status === MailStatus.ProcessedForDelivery) {
      expectedDelivery = estimateDelivery(
        trackingEvents[trackingEvents.length - 1].date,
        status
      );
    }
  }
  if (mail.delivered) status = MailStatus.Delivered;
  if (type === MailTypes.Letter) {
    return {
      type,
      recipientId,
      content,
      id,
      status,
      dateCreated,
      expectedDelivery,
      images,
      trackingEvents,
    };
  }
  return {
    type,
    recipientId,
    content,
    id,
    status,
    dateCreated,
    expectedDelivery,
    design,
    trackingEvents,
  };
}

export async function getSingleMail(id: number | undefined): Promise<Mail> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `letter/${id}`), {
    method: 'GET',
  });
  const data = body.data as RawMail;
  if (body.status !== 'OK' || !data) throw body;
  const cleanedMail = await cleanMail(data);
  return cleanedMail;
}

// cleans mail returned from getMail and defaults to getSingleMail if necessary
async function cleanMassMail(mail: RawMail): Promise<Mail> {
  if (!mail.lob_status || !mail.last_lob_status_update) {
    return getSingleMail(mail.id);
  }
  const { type, content, id } = mail;
  const recipientId = mail.contact_id;
  let images: Image[] = [];
  if (mail.images.length) {
    try {
      images = await Promise.all(
        mail.images.map(async (rawImage) => {
          const dimensions = await getImageDims(rawImage.img_src);
          return {
            uri: rawImage.img_src,
            ...dimensions,
          };
        })
      );
    } catch {
      images = mail.images.map((rawImage) => ({ uri: rawImage.img_src }));
    }
  }
  let design = { image: { uri: '' } };
  if (mail.images.length) {
    try {
      const dimensions = await getImageDims(mail.images[0].img_src);
      design = {
        image: {
          uri: mail.images[0].img_src,
          ...dimensions,
        },
      };
    } catch {
      design = { image: { uri: mail.images[0].img_src } };
    }
  }
  const dateCreated = new Date(mail.created_at);
  const lastLobUpdate = new Date(mail.last_lob_status_update);

  let status;
  if (!mail.sent) {
    status = MailStatus.Draft;
  } else {
    status = mail.delivered
      ? MailStatus.Delivered
      : cleanLobStatus(mail.lob_status);
  }

  const expectedDelivery = estimateDelivery(
    status === MailStatus.ProcessedForDelivery
      ? lastLobUpdate
      : new Date(mail.created_at),
    status
  );
  if (type === MailTypes.Letter) {
    return {
      type,
      recipientId,
      content,
      id,
      status,
      dateCreated,
      expectedDelivery,
      images,
    };
  }
  return {
    type,
    recipientId,
    content,
    id,
    status,
    dateCreated,
    expectedDelivery,
    design,
  };
}

export async function getMail(page = 1): Promise<Record<number, Mail[]>> {
  const params = new URLSearchParams({ page: page.toString() });
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `letters?${params}`),
    {
      method: 'GET',
    }
  );
  const data = body.data as { current_page: number; data: RawMail[] };
  if (body.status !== 'OK' || !data || !data.data) throw body;
  const newExisting: Record<number, Mail[]> = {};
  await Promise.all(
    data.data.map(async (raw) => {
      try {
        const clean = await cleanMassMail(raw);
        if (clean.recipientId in newExisting) {
          const mail = newExisting[clean.recipientId];
          let ix = 0;
          for (ix = 0; ix < mail.length; ix += 1) {
            const searchDate = mail[ix].dateCreated;
            if (
              clean.dateCreated &&
              searchDate &&
              clean.dateCreated > searchDate
            )
              break;
          }
          mail.splice(ix, 0, clean);
          newExisting[clean.recipientId] = mail;
        } else {
          newExisting[clean.recipientId] = [clean];
        }
      } catch (e) {
        throw Error(e.message);
      }
    })
  );
  store.dispatch(setExistingMail(newExisting));
  return newExisting;
}

export async function getTrackingEvents(id: number | undefined): Promise<Mail> {
  const mail = await getSingleMail(id);
  store.dispatch(setActive(mail));
  return mail;
}

export async function createMail(draft: Draft): Promise<Mail> {
  const { user } = store.getState().user;
  if (user.credit <= 0) {
    popupAlert({
      title: i18n.t('Compose.notEnoughCredits'),
      buttons: [{ text: i18n.t('Alert.okay') }],
    });
    throw new Error('Not enough credits');
  }

  const prepDraft = { ...draft };
  let imageExtension = {};
  if (prepDraft.type === MailTypes.Postcard) {
    try {
      if (prepDraft.design.custom) {
        prepDraft.design.image = await uploadImage(
          prepDraft.design.image,
          'letter'
        );
      }
      imageExtension = {
        s3_img_urls: [prepDraft.design.image.uri],
      };
    } catch (err) {
      const uploadError: ApiResponse = {
        status: 'ERROR',
        message:
          err.message === 'timeout' ? 'Image upload timeout' : err.message,
        date: Date.now(),
        data: {},
      };
      throw uploadError;
    }
  } else if (prepDraft.images.length) {
    try {
      const uris = await Promise.all(
        prepDraft.images.map(async (image) => {
          return (await uploadImage(image, 'letter')).uri;
        })
      );
      imageExtension = {
        s3_img_urls: uris,
      };
    } catch (err) {
      const uploadError: ApiResponse = {
        status: 'ERROR',
        message:
          err.message === 'timeout' ? 'Image upload timeout' : err.message,
        date: Date.now(),
        data: {},
      };
      throw uploadError;
    }
  }

  const reqBody: Record<string, unknown> = {
    contact_id: prepDraft.recipientId,
    content: prepDraft.content,
    is_draft: false,
    type: prepDraft.type,
    size: prepDraft.type === MailTypes.Postcard ? '4x6' : undefined,
    ...imageExtension,
  };
  const body = await fetchAuthenticated(url.resolve(API_URL, 'letter'), {
    method: 'POST',
    body: JSON.stringify(reqBody),
  });
  if (body.status !== 'OK' || !body.data) throw body;

  const data = body.data as RawMail;
  const createdMail = await cleanMassMail(data);
  store.dispatch(addMail(createdMail));
  user.credit -= 1;
  store.dispatch(setUser(user));
  return createdMail;
}

interface RawCategory {
  created_at: string;
  id: 1;
  img_src: string;
  name: string;
  updated_at: string;
  blurb: string;
}

function cleanCategory(
  raw: RawCategory,
  subcategories: Record<string, PostcardDesign[]>
): Category {
  return {
    id: raw.id,
    name: raw.name,
    image: { uri: raw.img_src },
    blurb: raw.blurb,
    subcategories,
  };
}

interface RawDesign {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  front_img_src: string;
  thumbnail_src: string;
  type: MailTypes;
  back: null;
  subcategory_id: number;
}

async function cleanDesign(
  raw: RawDesign,
  categoryId?: number,
  subcategoryName?: string
): Promise<PostcardDesign> {
  try {
    const imageDims = await getImageDims(raw.front_img_src);
    const thumbnailDims = await getImageDims(raw.thumbnail_src);
    return {
      image: {
        uri: raw.front_img_src,
        ...imageDims,
      },
      thumbnail: { uri: raw.thumbnail_src, ...thumbnailDims },
      name: raw.name,
      id: raw.id,
      categoryId,
      subcategoryName,
    };
  } catch (err) {
    return {
      image: {
        uri: raw.front_img_src,
      },
      thumbnail: { uri: raw.thumbnail_src },
      name: raw.name,
      id: raw.id,
      categoryId,
      subcategoryName,
    };
  }
}

export async function getSubcategoriesById(
  categoryId: number
): Promise<Record<string, PostcardDesign[]>> {
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `designs/${categoryId}`)
  );
  if (body.status !== 'OK' || !body.data) throw body;
  const data = body.data as Record<string, RawDesign[]>;
  const cleanData: Record<string, PostcardDesign[]> = {};
  const subNames = Object.keys(data);
  for (let ix = 0; ix < subNames.length; ix += 1) {
    const subName = subNames[ix];
    cleanData[subName] = await Promise.all(
      data[subName].map((raw: RawDesign) =>
        cleanDesign(raw, categoryId, subName)
      )
    );
  }
  return cleanData;
}

export async function getCategories(): Promise<Category[]> {
  const body = await fetchAuthenticated(url.resolve(API_URL, 'categories'));
  if (body.status !== 'OK' || !body.data) throw body;
  const data = body.data as RawCategory[];
  const categories: Category[] = await Promise.all(
    data.map(async (raw: RawCategory) => {
      const subcategories = await getSubcategoriesById(raw.id);
      return cleanCategory(raw, subcategories);
    })
  );
  const personalIx = categories.findIndex(
    (cat: Category) => cat.name === 'personal'
  );
  const personalCategory = categories.splice(personalIx, 1);
  categories.unshift(personalCategory[0]);
  store.dispatch(setCategories(categories));
  store.dispatch(setLastUpdated(new Date().toISOString()));
  return categories;
}

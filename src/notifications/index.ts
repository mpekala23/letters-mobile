import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import i18n from '@i18n';
import { Linking, Platform } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import { popupAlert } from '@components/Alert/Alert.react';
import { Colors } from '@styles';
import {
  NotificationRequest,
  NotificationResponse,
  PushTokenListener,
} from 'expo-notifications';
import { Notif, NotifTypes, FutureNotif } from '@store/Notif/NotifTypes';
import {
  addBusinessDays,
  addDays,
  addHours,
  addSeconds,
  format,
} from 'date-fns';
import store from '@store';
import { Contact, Mail, Subscription } from 'types';
import { setActive as setActiveContact } from '@store/Contact/ContactActions';
import { setActive as setActiveMail } from '@store/Mail/MailActions';
import { resetNavigation } from '@utils';
import { Screens } from '@utils/Screens';
import * as Segment from 'expo-analytics-segment';
import {
  setUnrespondedNotifs,
  setFutureNotifs,
} from '@store/Notif/NotifiActions';

export async function getPushToken(): Promise<string> {
  if (!Constants.isDevice) {
    popupAlert({
      title: i18n.t('Alert.emulatorDetected'),
      message: i18n.t('Alert.mustUsePhysical'),
      buttons: [{ text: i18n.t('Alert.okay') }],
    });
    return '';
  }
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (finalStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    popupAlert({
      title: i18n.t('Alert.weNeedNotificationsPermission'),
      message: i18n.t('Alert.goToSettingsToUpdate'),
      buttons: [
        {
          text: i18n.t('Alert.goToSettings'),
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              IntentLauncher.startActivityAsync(
                IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
              );
            }
          },
        },
        {
          text: i18n.t('Alert.maybeLater'),
          reverse: true,
        },
      ],
    });
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: Colors.BLUE_400,
      });
    }
  }
  const expoToken = await Notifications.getExpoPushTokenAsync();
  if (expoToken.data) return expoToken.data;
  return '';
}

export function addPushTokenListener(func: PushTokenListener): void {
  Notifications.addPushTokenListener(func);
}

export function removePushTokenListeners(): void {
  Notifications.removeAllPushTokenListeners();
}

function cleanNotificationRequest(request: NotificationRequest): Notif | null {
  const { title, body } = request.content;
  let dataFormat = request.content.data as {
    type: NotifTypes;
    data?: {
      contactId?: number;
      letterId?: number;
      routes?: { name: Screens }[];
    };
  };
  if (!dataFormat.type) {
    dataFormat = request.content.data.body as {
      type: NotifTypes;
      data?: {
        contactId?: number;
        letterId?: number;
        routes?: { name: Screens }[];
      };
    };
  }
  const { type } = dataFormat;
  const { contactId, letterId, routes } = dataFormat.data
    ? dataFormat.data
    : { contactId: undefined, letterId: undefined, routes: undefined };
  if (!title || !body) return null;
  return {
    title,
    body,
    type,
    data: {
      contactId,
      letterId,
      routes,
    },
  };
}

export async function scheduleNotificationAtTime(
  notif: Notif,
  time: Date
): Promise<void> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: notif.title,
      body: notif.body,
      data: {
        type: notif.type,
        data: {
          ...notif.data,
        },
      },
    },
    trigger: time,
  });
  const futureNotifs = [...store.getState().notif.futureNotifs];
  futureNotifs.push({
    id,
    time: time.toISOString(),
    notif,
  });
  store.dispatch(setFutureNotifs(futureNotifs));
}

export async function scheduleNotificationInSeconds(
  notif: Notif,
  seconds: number
): Promise<void> {
  const time = addSeconds(new Date(), seconds);
  await scheduleNotificationAtTime(notif, time);
}

export async function scheduleNotificationInHours(
  notif: Notif,
  hours: number
): Promise<void> {
  const time = addHours(new Date(), hours);
  await scheduleNotificationAtTime(notif, time);
}

export async function scheduleNotificationInDays(
  notif: Notif,
  days: number
): Promise<void> {
  const time = addDays(new Date(), days);
  time.setHours(20);
  await scheduleNotificationAtTime(notif, time);
}

export async function scheduleNotificationInBusinessDays(
  notif: Notif,
  bdays: number
): Promise<void> {
  const time = addBusinessDays(new Date(), bdays);
  time.setHours(20);
  await scheduleNotificationAtTime(notif, time);
}

export async function cancelAllNotificationsByType(
  type: NotifTypes
): Promise<void> {
  const scheduled = store.getState().notif.futureNotifs;
  const removing = scheduled.filter((fNotif) => fNotif.notif.type === type);
  const keeping = scheduled.filter((fNotif) => fNotif.notif.type !== type);
  await Promise.all(
    removing.map(async (fNotif) => {
      await Notifications.cancelScheduledNotificationAsync(fNotif.id);
    })
  );
  store.dispatch(setFutureNotifs(keeping));
}

export function purgeFutureNotifs(): FutureNotif[] {
  const currentTime = new Date().toISOString();
  const scheduled = store.getState().notif.futureNotifs;
  const removing = scheduled.filter((fNotif) => fNotif.time < currentTime);
  const keeping = scheduled.filter((fNotif) => fNotif.time >= currentTime);
  store.dispatch(setFutureNotifs(keeping));
  return removing;
}

// called when a notification is received by the phone
async function notifReceived({
  request,
}: {
  request: NotificationRequest;
}): Promise<void> {
  const notif = cleanNotificationRequest(request);
  if (!notif) return;

  const newUnresponded = store.getState().notif.unrespondedNotifs;
  newUnresponded.push(notif);
  store.dispatch(setUnrespondedNotifs(newUnresponded));

  switch (notif.type) {
    case NotifTypes.ProcessedForDelivery:
      scheduleNotificationInBusinessDays(
        {
          title: `${i18n.t('Notifs.hasYourLovedOne')}`,
          body: `${i18n.t('Notifs.letUsKnow')}`,
          type: NotifTypes.HasReceived,
          data: {
            contactId: notif.data && notif.data.contactId,
            letterId: notif.data && notif.data.letterId,
          },
        },
        5
      );
      break;
    default:
      break;
  }
}

// called when a notification is interacted with
function notifResponse(event: NotificationResponse): void {
  Segment.trackWithProperties('App Open', {
    channel: 'Push',
    'App Version': process.env.APP_VERSION,
    'Native Build Version': Constants.nativeBuildVersion,
  });
  const notif = cleanNotificationRequest(event.notification.request);
  if (!notif) return;
  const state = store.getState();

  const newUnresponded = state.notif.unrespondedNotifs.filter((testNotif) => {
    return (
      testNotif.type !== notif.type ||
      testNotif.title !== notif.title ||
      testNotif.body !== notif.body
    );
  });
  store.dispatch(setUnrespondedNotifs(newUnresponded));

  let contact: Contact | undefined;
  if (notif.data && notif.data.contactId) {
    contact = state.contact.existing.find((testContact) => {
      return notif.data && testContact.id === notif.data.contactId;
    });
  }
  if (contact) {
    store.dispatch(setActiveContact(contact));
  }
  let mail: Mail | undefined;
  if (contact && notif.data && notif.data.letterId) {
    mail = state.mail.existing[contact.id].find(
      (testMail) => notif.data && testMail.id === notif.data.letterId
    );
  }
  if (mail) {
    store.dispatch(setActiveMail(mail));
  }
  const commonTracks = {
    hour: format(new Date(), 'hh'),
    weekday: format(new Date(), 'dddd'),
    type: 'In Transit',
  };
  switch (notif.type) {
    case NotifTypes.OnItsWay:
      Segment.trackWithProperties('Notifications - Click on Delivery Update', {
        ...commonTracks,
      });
      resetNavigation({
        index: 0,
        routes: [
          { name: Screens.ContactSelector },
          { name: Screens.SingleContact },
          { name: Screens.MailTracking },
        ],
      });
      break;
    case NotifTypes.ProcessedForDelivery:
      Segment.trackWithProperties('Notifications - Click on Delivery Update', {
        ...commonTracks,
      });
      resetNavigation({
        index: 0,
        routes: [
          { name: Screens.ContactSelector },
          { name: Screens.SingleContact },
          { name: Screens.MailTracking },
        ],
      });
      break;
    case NotifTypes.HasReceived:
      Segment.track('Notifications - Delivery Check-In ');
      resetNavigation({
        index: 0,
        routes: [
          { name: Screens.ContactSelector },
          { name: Screens.SingleContact },
          { name: Screens.MailTracking },
          { name: Screens.Issues },
        ],
      });
      break;
    case NotifTypes.ReturnedToSender:
      Segment.trackWithProperties('Notifications - Returned to Sender', {
        ...commonTracks,
      });
      resetNavigation({
        index: 0,
        routes: [
          { name: Screens.ContactSelector },
          { name: Screens.SingleContact },
          { name: Screens.MailTracking },
        ],
      });
      break;
    case NotifTypes.NoFirstContact:
      Segment.trackWithProperties(
        'Notifications - Click on Add First Contact',
        {
          ...commonTracks,
        }
      );
      resetNavigation({
        index: 0,
        routes: [
          { name: Screens.ContactSelector },
          { name: Screens.ContactInfo },
        ],
      });
      break;
    case NotifTypes.NoFirstLetter:
      Segment.trackWithProperties(
        'Notifications - Click on Send First Letter',
        {
          ...commonTracks,
        }
      );
      resetNavigation({
        index: 0,
        routes: [
          { name: Screens.ContactSelector },
          { name: Screens.SingleContact },
          { name: Screens.ChooseCategory },
        ],
      });
      break;
    case NotifTypes.Drought:
      Segment.trackWithProperties(
        'Notifications - Click on Send Weekly Letter',
        {
          ...commonTracks,
        }
      );
      resetNavigation({
        index: 0,
        routes: [
          { name: Screens.ContactSelector },
          { name: Screens.SingleContact },
          { name: Screens.ChooseCategory },
        ],
      });
      break;
    case NotifTypes.ReferralSignup:
      Segment.trackWithProperties('Notifications - Click on Referral Signup', {
        ...commonTracks,
      });
      resetNavigation({
        index: 0,
        routes: [
          { name: Screens.ContactSelector },
          { name: Screens.ReferralDashboard },
        ],
      });
      break;
    case NotifTypes.SpecialEvent:
      Segment.trackWithProperties(
        'Notifications - Click on Send Weekly Letter',
        {
          ...commonTracks,
          title: notif.title,
        }
      );
      resetNavigation({
        index: 0,
        routes: [
          { name: Screens.ContactSelector },
          { name: Screens.SingleContact },
          { name: Screens.ChooseCategory },
        ],
      });
      break;
    case NotifTypes.Wildcard:
      Segment.trackWithProperties('Notifications - Click on Wildcard', {
        ...commonTracks,
        title: notif.title,
      });
      if (notif.data && notif.data.routes) {
        resetNavigation({
          index: 0,
          routes: notif.data.routes,
        });
      }
      break;
    default:
      break;
  }
}

export function setupNotifs(): Subscription[] {
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    notifReceived
  );
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    notifResponse
  );
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  purgeFutureNotifs();
  return [receivedSubscription, responseSubscription];
}

export function cleanupNotifs(notifSubscriptions: Subscription[]): void {
  notifSubscriptions.forEach((sub) => {
    sub.remove();
  });
}

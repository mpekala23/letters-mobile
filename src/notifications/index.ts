import { createRef, ReactText } from 'react';
import { Platform, Linking } from 'react-native';
import { popupAlert } from '@components/Alert/Alert.react';
import { EventSubscription } from 'fbemitter';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Notification } from 'expo/build/Notifications/Notifications.types';
import store from '@store';
import { addNotif, setFutureNotifs } from '@store/Notif/NotifiActions';
import { NavigationContainerRef } from '@react-navigation/native';
import {
  NotifTypes,
  Notif,
  NativeNotif,
  FutureNotif,
} from '@store/Notif/NotifTypes';
import { AppState } from '@store/types';
import { loginWithToken } from '@api';
import i18n from '@i18n';
import { Contact } from '@store/Contact/ContactTypes';
import { setActive as setActiveContact } from '@store/Contact/ContactActions';
import { setActive as setActiveLetter } from '@store/Letter/LetterActions';
import { Letter } from 'types';

export const navigationRef = createRef<NavigationContainerRef>();

export function navigate(name: string, params = {}): void {
  if (navigationRef.current) navigationRef.current.navigate(name, params);
}

export function resetNavigation({
  index,
  routes,
}: {
  index: number;
  routes: { name: string }[];
}): void {
  if (navigationRef.current) {
    navigationRef.current.reset({ index, routes });
  }
}

class NotifsBase {
  private expoPushToken = '';

  private notificationSubscription: EventSubscription;

  constructor() {
    this.notifHandler = this.notifHandler.bind(this);
    this.purgeFutureNotifs = this.purgeFutureNotifs.bind(this);
    this.notificationSubscription = Notifications.addListener(
      this.notifHandler
    );
  }

  subscribe() {
    this.unsubscribe();
    this.notificationSubscription = Notifications.addListener(
      this.notifHandler
    );
  }

  unsubscribe() {
    if (this.notificationSubscription) this.notificationSubscription.remove();
  }

  getToken() {
    return this.expoPushToken;
  }

  goToSettings = () => {
    Linking.openURL('app-settings:');
  };

  async setup() {
    await this.registerForPushNotifications();
    this.purgeFutureNotifs();
  }

  async registerForPushNotifications() {
    if (!Constants.isDevice) {
      popupAlert({
        title: i18n.t('Alert.emulatorDetected'),
        message: i18n.t('Alert.mustUsePhysical'),
        buttons: [{ text: i18n.t('Alert.okay') }],
      });
      return;
    }
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
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
            onPress: this.goToSettings,
          },
          {
            text: i18n.t('Alert.maybeLater'),
            reverse: true,
          },
        ],
      });
      return;
    }
    this.expoPushToken = await Notifications.getExpoPushTokenAsync();
    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  }

  purgeFutureNotifs = () => {
    // in order to make it so that a notification which was just acted upon is properly purged
    // from future notifications, a one second offset on the current time is needed
    const ONE_SECOND = 1000;
    const currentTime = new Date(Date.now()).getTime() + ONE_SECOND;
    const { futureNotifs } = store.getState().notif;
    const newFuture = [];
    for (let ix = 0; ix < futureNotifs.length; ix += 1) {
      if (futureNotifs[ix].time >= currentTime) {
        newFuture.push(futureNotifs[ix]);
      }
    }
    store.dispatch(setFutureNotifs(newFuture));
  };

  async notifHandler(notification: Notification) {
    this.purgeFutureNotifs();
    if (notification.origin === 'received') return;
    const notif: Notif = notification.data;
    store.dispatch(addNotif(notif));
    const state: AppState = store.getState();
    if (!state.user.authInfo.isLoggedIn) {
      try {
        await loginWithToken();
      } catch (err) {
        resetNavigation({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }
    }
    let contact: Contact | null = null;
    let letter: Letter | null = null;
    const getContact = (id: number): Contact | null => {
      for (let ix = 0; ix < state.contact.existing.length; ix += 1) {
        if (id === state.contact.existing[ix].id) {
          return state.contact.existing[ix];
        }
      }
      return null;
    };
    const getLetter = (contactId: number, letterId: number): Letter | null => {
      for (let jx = 0; jx < state.letter.existing[contactId].length; jx += 1) {
        if (letterId === state.letter.existing[contactId][jx].letterId) {
          return state.letter.existing[contactId][jx];
        }
      }
      return null;
    };
    switch (notif.type) {
      case NotifTypes.FirstLetter:
        navigate('FirstLetter');
        break;
      case NotifTypes.OnItsWay:
      case NotifTypes.OutForDelivery:
        if (!notif.data || !notif.data.contactId || !notif.data.letterId) break;
        contact = getContact(notif.data.contactId);
        if (!contact) break;
        store.dispatch(setActiveContact(contact));
        letter = getLetter(contact.id, notif.data.letterId);
        if (!letter) {
          resetNavigation({
            index: 0,
            routes: [{ name: 'ContactSelector' }, { name: 'SingleContact' }],
          });
          break;
        }
        store.dispatch(setActiveLetter(letter));
        resetNavigation({
          index: 0,
          routes: [
            { name: 'ContactSelector' },
            { name: 'SingleContact' },
            { name: 'LetterTracking' },
          ],
        });
        break;
      case NotifTypes.HasReceived:
        if (!notif.data || !notif.data.contactId || !notif.data.letterId) break;
        contact = getContact(notif.data.contactId);
        if (!contact) break;
        store.dispatch(setActiveContact(contact));
        letter = getLetter(contact.id, notif.data.letterId);
        if (!letter) {
          resetNavigation({
            index: 0,
            routes: [{ name: 'ContactSelector' }, { name: 'SingleContact' }],
          });
          break;
        }
        store.dispatch(setActiveLetter(letter));
        resetNavigation({
          index: 0,
          routes: [
            { name: 'ContactSelector' },
            { name: 'SingleContact' },
            { name: 'LetterTracking' },
            { name: 'Issues' },
          ],
        });
        break;
      case NotifTypes.ReturnedToSender:
        if (!notif.data || !notif.data.contactId || !notif.data.letterId) break;
        contact = getContact(notif.data.contactId);
        if (!contact) break;
        store.dispatch(setActiveContact(contact));
        letter = getLetter(contact.id, notif.data.letterId);
        if (!letter) {
          resetNavigation({
            index: 0,
            routes: [{ name: 'ContactSelector' }, { name: 'SingleContact' }],
          });
          break;
        }
        store.dispatch(setActiveLetter(letter));
        resetNavigation({
          index: 0,
          routes: [
            { name: 'ContactSelector' },
            { name: 'SingleContact' },
            { name: 'LetterTracking' },
          ],
        });
        break;
      case NotifTypes.NoFirstContact:
        resetNavigation({
          index: 0,
          routes: [{ name: 'ContactSelector' }, { name: 'ContactInfo' }],
        });
        break;
      case NotifTypes.NoFirstLetter:
        if (notif.data && notif.data.contactId) {
          for (let ix = 0; ix < state.contact.existing.length; ix += 1) {
            if (notif.data.contactId === state.contact.existing[ix].id) {
              contact = state.contact.existing[ix];
            }
          }
          if (contact) store.dispatch(setActiveContact(contact));
        } else {
          break;
        }
        resetNavigation({
          index: 0,
          routes: [{ name: 'ContactSelector' }, { name: 'SingleContact' }],
        });
        break;
      default:
        break;
    }
  }

  scheduleNotificationInHours = async (
    nativeNotif: NativeNotif,
    hours: number
  ) => {
    const time = new Date(Date.now()).getTime() + 1000 * 60 * 60 * hours;
    const id = await Notifications.scheduleLocalNotificationAsync(nativeNotif, {
      time,
    });
    const { futureNotifs } = store.getState().notif;
    const adding: FutureNotif = {
      id,
      time,
      nativeNotif,
    };
    futureNotifs.push(adding);
    store.dispatch(setFutureNotifs(futureNotifs));
    return id;
  };

  scheduleNotificationInDays = async (
    nativeNotif: NativeNotif,
    days: number
  ) => {
    const time = new Date(Date.now()).getTime() + 1000 * 60 * 60 * 24 * days;
    const id = await Notifications.scheduleLocalNotificationAsync(nativeNotif, {
      time,
    });
    const { futureNotifs } = store.getState().notif;
    const adding: FutureNotif = {
      id,
      time,
      nativeNotif,
    };
    futureNotifs.push(adding);
    store.dispatch(setFutureNotifs(futureNotifs));
  };

  cancelNotificationById = async (id: string) => {
    const result = await Notifications.cancelScheduledNotificationAsync(id);
    const { futureNotifs } = store.getState().notif;
    const newFuture = [];
    for (let ix = 0; ix < futureNotifs.length; ix += 1) {
      if (futureNotifs[ix].id !== id) {
        newFuture.push(futureNotifs[ix]);
      }
    }
    store.dispatch(setFutureNotifs(newFuture));
    return result;
  };

  // cancels the most recently scheduled notification of a certain type
  cancelSingleNotificationByType = async (type: NotifTypes) => {
    const { futureNotifs } = store.getState().notif;
    const newFuture = [];
    let hasRemoved = false;
    let removingId: ReactText = '';
    for (let ix = futureNotifs.length - 1; ix >= 0; ix -= 1) {
      if (futureNotifs[ix].nativeNotif.data.type !== type || hasRemoved) {
        newFuture.push(futureNotifs[ix]);
      } else {
        removingId = futureNotifs[ix].id;
        hasRemoved = true;
      }
    }
    newFuture.reverse();
    const result = await Notifications.cancelScheduledNotificationAsync(
      removingId
    );
    store.dispatch(setFutureNotifs(newFuture));
    return result;
  };

  cancelAllNotificationsByType = async (type: NotifTypes) => {
    const { futureNotifs } = store.getState().notif;
    const newFuture = [];
    const removingIds = [];
    for (let ix = 0; ix < futureNotifs.length; ix += 1) {
      if (futureNotifs[ix].nativeNotif.data.type !== type) {
        newFuture.push(futureNotifs[ix]);
      } else {
        removingIds.push(futureNotifs[ix].id);
      }
    }
    let result;
    for (let jx = 0; jx < removingIds.length; jx += 1) {
      // eslint-disable-next-line no-await-in-loop
      result = await Notifications.cancelScheduledNotificationAsync(
        removingIds[jx]
      );
    }
    store.dispatch(setFutureNotifs(newFuture));
    return result;
  };

  cancelAllNotifications = async () => {
    const result = await Notifications.cancelAllScheduledNotificationsAsync();
    store.dispatch(setFutureNotifs([]));
    return result;
  };
}

const Notifs = new NotifsBase();

export default Notifs;

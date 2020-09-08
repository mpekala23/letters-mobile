import { createRef, ReactText } from 'react';
import { Platform, Linking } from 'react-native';
import { popupAlert } from '@components/Alert/Alert.react';
import { EventSubscription } from 'fbemitter';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import {
  Notification,
  LocalNotification,
} from 'expo/build/Notifications/Notifications.types';
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
import { setActive as setActiveContact } from '@store/Contact/ContactActions';
import { setActive as setActiveMail } from '@store/Mail/MailActions';
import { Mail, Contact } from 'types';
import { addBusinessDays, format } from 'date-fns';
import * as Segment from 'expo-analytics-segment';
import { Screens } from '@utils/Screens';

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
    Segment.trackWithProperties('App Open', {
      channel: 'Push',
      'App Version': process.env.APP_VERSION,
      'Native Build Version': Constants.nativeBuildVersion,
    });
    const notif: Notif = notification.data;
    store.dispatch(addNotif(notif));
    const state: AppState = store.getState();
    const { futureNotifs } = state.notif;
    if (!state.user.authInfo.isLoggedIn) {
      try {
        await loginWithToken();
      } catch (err) {
        resetNavigation({
          index: 0,
          routes: [{ name: Screens.Begin }, { name: Screens.Login }],
        });
        return;
      }
    }
    let contact: Contact | null = null;
    let mail: Mail | null = null;
    const getContact = (id: number): Contact | null => {
      for (let ix = 0; ix < state.contact.existing.length; ix += 1) {
        if (id === state.contact.existing[ix].id) {
          return state.contact.existing[ix];
        }
      }
      return null;
    };
    const getMail = (contactId: number, id: number): Mail | null => {
      for (let jx = 0; jx < state.mail.existing[contactId].length; jx += 1) {
        if (id === state.mail.existing[contactId][jx].id) {
          return state.mail.existing[contactId][jx];
        }
      }
      return null;
    };
    switch (notif.type) {
      case NotifTypes.OnItsWay:
        Segment.trackWithProperties(
          'Notifications - Click on Delivery Update',
          {
            hour: format(new Date(), 'hh'),
            weekday: format(new Date(), 'dddd'),
            type: 'In Transit',
          }
        );
        if (!notif.data || !notif.data.contactId || !notif.data.letterId) break;
        contact = getContact(notif.data.contactId);
        if (!contact) break;
        store.dispatch(setActiveContact(contact));
        mail = getMail(contact.id, notif.data.letterId);
        if (!mail) {
          resetNavigation({
            index: 0,
            routes: [
              { name: Screens.ContactSelector },
              { name: Screens.SingleContact },
            ],
          });
          break;
        }
        store.dispatch(setActiveMail(mail));
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
        Segment.trackWithProperties(
          'Notifications - Click on Delivery Update',
          {
            hour: format(new Date(), 'hh'),
            weekday: format(new Date(), 'dddd'),
            type: 'Out for Delivery',
          }
        );
        if (!notif.data || !notif.data.contactId || !notif.data.letterId) break;
        contact = getContact(notif.data.contactId);
        if (!contact) break;
        store.dispatch(setActiveContact(contact));
        mail = getMail(contact.id, notif.data.letterId);
        if (!mail) {
          resetNavigation({
            index: 0,
            routes: [
              { name: Screens.ContactSelector },
              { name: Screens.SingleContact },
            ],
          });
          break;
        }
        store.dispatch(setActiveMail(mail));
        this.scheduleNotification(
          {
            title: `${i18n.t('Notifs.hasYourLovedOne')}`,
            body: `${i18n.t('Notifs.letUsKnow')}`,
            data: {
              type: NotifTypes.HasReceived,
              data: {
                contactId: contact.id,
                letterId: mail.id,
              },
            },
          },
          addBusinessDays(new Date(), 3)
        );
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
        if (!notif.data || !notif.data.contactId || !notif.data.letterId) break;
        contact = getContact(notif.data.contactId);
        if (!contact) break;
        store.dispatch(setActiveContact(contact));
        mail = getMail(contact.id, notif.data.letterId);
        if (!mail) {
          resetNavigation({
            index: 0,
            routes: [
              { name: Screens.ContactSelector },
              { name: Screens.SingleContact },
            ],
          });
          break;
        }
        store.dispatch(setActiveMail(mail));
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
        if (!notif.data || !notif.data.contactId || !notif.data.letterId) break;
        for (let ix = 0; ix < futureNotifs.length; ix += 1) {
          if (
            futureNotifs[ix].nativeNotif.data.type === NotifTypes.HasReceived &&
            futureNotifs[ix].nativeNotif.data.data?.letterId ===
              notif.data.letterId
          ) {
            // eslint-disable-next-line no-await-in-loop
            await this.cancelNotificationById(futureNotifs[ix].id);
          }
        }
        contact = getContact(notif.data.contactId);
        if (!contact) break;
        store.dispatch(setActiveContact(contact));
        mail = getMail(contact.id, notif.data.letterId);
        if (!mail) {
          resetNavigation({
            index: 0,
            routes: [
              { name: Screens.ContactSelector },
              { name: Screens.SingleContact },
            ],
          });
          break;
        }
        store.dispatch(setActiveMail(mail));
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
            hour: format(new Date(), 'hh'),
            weekday: format(new Date(), 'dddd'),
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
            hour: format(new Date(), 'hh'),
            weekday: format(new Date(), 'dddd'),
          }
        );
        if (notif.data && notif.data.contactId) {
          for (let ix = 0; ix < state.contact.existing.length; ix += 1) {
            if (notif.data.contactId === state.contact.existing[ix].id) {
              contact = state.contact.existing[ix];
            }
          }
        } else {
          break;
        }
        if (contact) store.dispatch(setActiveContact(contact));
        resetNavigation({
          index: 0,
          routes: [
            { name: Screens.ContactSelector },
            { name: Screens.SingleContact },
          ],
        });
        break;
      case NotifTypes.Drought:
        Segment.trackWithProperties(
          'Notifications - Click on Send Weekly Letter',
          {
            channel: 'Push',
            hour: format(new Date(), 'hh'),
            weekday: format(new Date(), 'dddd'),
          }
        );
        resetNavigation({
          index: 0,
          routes: [
            { name: Screens.ContactSelector },
            { name: Screens.SingleContact },
            { name: Screens.ChooseOption },
          ],
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

  scheduleNotification = async (nativeNotif: NativeNotif, time: Date) => {
    const id = await Notifications.scheduleLocalNotificationAsync(nativeNotif, {
      time,
    });
    const { futureNotifs } = store.getState().notif;
    const adding: FutureNotif = {
      id,
      time: time.getTime(),
      nativeNotif,
    };
    futureNotifs.push(adding);
    store.dispatch(setFutureNotifs(futureNotifs));
  };

  cancelNotificationById = async (id: ReactText): Promise<void> => {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      const { futureNotifs } = store.getState().notif;
      const newFuture = futureNotifs.filter(
        (value: FutureNotif) => value.id !== id
      );
      store.dispatch(setFutureNotifs(newFuture));
    } catch (err) {
      /* do nothing */
    }
  };

  // cancels the most recently scheduled notification of a certain type
  cancelSingleNotificationByType = async (type: NotifTypes): Promise<void> => {
    try {
      const { futureNotifs } = store.getState().notif;
      let hasRemoved = false;
      let removingId: ReactText = '';
      const newFuture = futureNotifs.reverse().filter((value: FutureNotif) => {
        if (value.nativeNotif.data.type !== type || hasRemoved) {
          return true;
        }
        removingId = value.id;
        hasRemoved = true;
        return false;
      });
      await Notifications.cancelScheduledNotificationAsync(removingId);
      store.dispatch(setFutureNotifs(newFuture));
    } catch (err) {
      /* do nothing */
    }
  };

  cancelAllNotificationsByType = async (type: NotifTypes): Promise<void> => {
    try {
      const { futureNotifs } = store.getState().notif;
      const removingIds: ReactText[] = [];
      const newFuture = futureNotifs.filter((value: FutureNotif) => {
        if (value.nativeNotif.data.type !== type) {
          return true;
        }
        removingIds.push(value.id);
        return false;
      });

      await Promise.all(
        removingIds.map(
          async (value: ReactText): Promise<void> => {
            await Notifications.cancelScheduledNotificationAsync(value);
          }
        )
      );
      store.dispatch(setFutureNotifs(newFuture));
    } catch (err) {
      /* do nothing */
    }
  };

  cancelAllNotifications = async (): Promise<void> => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      store.dispatch(setFutureNotifs([]));
    } catch (err) {
      /* do nothing */
    }
  };
}

const Notifs = new NotifsBase();

export default Notifs;

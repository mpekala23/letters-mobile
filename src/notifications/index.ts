import React, { createRef, ReactText } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import { EventSubscription } from 'fbemitter';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Notification } from 'expo/build/Notifications/Notifications.types';
import { loadToken } from '@api';
import store from '@store';
import {
  addNotif,
  handleNotif,
  setFutureNotifs,
  setPastNotifs,
} from '@store/Notif/NotifiActions';
import { NavigationContainerRef } from '@react-navigation/native';
import {
  NotifType,
  Notif,
  NativeNotif,
  FutureNotif,
} from 'store/Notif/NotifTypes';
import { AppState } from 'store/types';

export const navigationRef = createRef<NavigationContainerRef>();

export function navigate(name: string, params = {}): void {
  if (navigationRef.current) navigationRef.current.navigate(name, params);
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
      Alert.alert(
        'Error',
        'Must use a physical device to receive push notifications.'
      );
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
      Alert.alert(
        'Enable Notifications',
        'Go to settings to receive notifications about your letters.',
        [{ text: 'Dismiss' }, { text: 'Settings', onPress: this.goToSettings }]
      );
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
    const currentTime = new Date().getTime() + ONE_SECOND;
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
    const notif: Notif = notification.data;
    store.dispatch(addNotif(notif));
    const state = store.getState();
    switch (notif.type) {
      case NotifType.FirstLetter:
        if (!state.user.authInfo.isLoggedIn) {
          try {
            await loadToken();
          } catch (err) {
            navigate('Login');
            return;
          }
        }
        navigate('FirstLetter');
        break;
      default:
    }
  }

  scheduleNotificationInHours = async (
    nativeNotif: NativeNotif,
    hours: number
  ) => {
    const time = new Date().getTime() + 1000 * 60 * 60 * hours;
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
    const time = new Date().getTime() + 1000 * 60 * 60 * 24 * days;
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

  cancelNotificationById = (id: string) => {
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
  cancelSingleNotificationByType = async (type: NotifType) => {
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

  cancelAllNotificationsByType = async (type: NotifType) => {
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

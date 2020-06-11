import React, { createRef, ReactText } from "react";
import { Alert, Platform, Linking } from "react-native";
import { EventSubscription } from "fbemitter";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { Notification } from "expo/build/Notifications/Notifications.types";
import { loadToken } from "@api";
import store from "@store";
import {
  addNotif,
  handleNotif,
  setFutureNotifs,
  setPastNotifs,
} from "@store/Notif/NotifiActions";
import { NavigationContainerRef } from "@react-navigation/native";
import {
  NotifType,
  Notif,
  NativeNotif,
  FutureNotif,
} from "store/Notif/NotifTypes";

export const navigationRef = createRef<NavigationContainerRef>();

export function navigate(name: string, params = {}) {
  navigationRef.current?.navigate(name, params);
}

class NotifsBase {
  private expoPushToken = "";
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

  goToSettings() {
    Linking.openURL("app-settings:");
  }

  async setup() {
    await this.registerForPushNotifications();
  }

  async registerForPushNotifications() {
    if (!Constants.isDevice) {
      Alert.alert(
        "Error",
        "Must use a physical device to receive push notifications."
      );
      return;
    }
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      const finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        "Enable Notifications",
        "Go to settings to receive notifications about your letters.",
        [{ text: "Dismiss" }, { text: "Settings", onPress: this.goToSettings }]
      );
      return;
    }
    this.expoPushToken = await Notifications.getExpoPushTokenAsync();
    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  }

  purgeFutureNotifs() {
    // offset to account for notifications received in app
    const currentTime = new Date().getTime() + 1000;
    const futureNotifs = store.getState().notif.futureNotifs;
    const newFuture = [];
    for (let ix = 0; ix < futureNotifs.length; ++ix) {
      if (futureNotifs[ix].time >= currentTime) {
        newFuture.push(futureNotifs[ix]);
      }
    }
    store.dispatch(setFutureNotifs(newFuture));
  }

  async notifHandler(notification: Notification) {
    this.purgeFutureNotifs();
    const notif: Notif = notification.data;
    store.dispatch(addNotif(notif));
    switch (notif.type) {
      case NotifType.FirstLetter:
        const state = store.getState();
        if (!state.user.authInfo.isLoggedIn) {
          try {
            await loadToken();
          } catch (err) {
            navigate("Login");
            return;
          }
        }
        navigate("FirstLetter");
        return;
      default:
        return;
    }
  }

  async scheduleNotificationInHours(nativeNotif: NativeNotif, hours: number) {
    const time = new Date().getTime() + 1000 * 60 * 60 * hours;
    try {
      const id = await Notifications.scheduleLocalNotificationAsync(
        nativeNotif,
        { time }
      );
      const futureNotifs = store.getState().notif.futureNotifs;
      const adding: FutureNotif = {
        id,
        time,
        nativeNotif,
      };
      futureNotifs.push(adding);
      store.dispatch(setFutureNotifs(futureNotifs));
      return id;
    } catch (err) {
      throw Error(err);
    }
  }

  async scheduleNotificationInDays(nativeNotif: NativeNotif, days: number) {
    const time = new Date().getTime() + 1000 * 60 * 60 * 24 * days;
    try {
      const id = await Notifications.scheduleLocalNotificationAsync(
        nativeNotif,
        { time }
      );
      const futureNotifs = store.getState().notif.futureNotifs;
      const adding: FutureNotif = {
        id,
        time,
        nativeNotif,
      };
      futureNotifs.push(adding);
      store.dispatch(setFutureNotifs(futureNotifs));
    } catch (err) {
      throw Error(err);
    }
  }

  async cancelNotificationById(id: string) {
    try {
      const result = await Notifications.cancelScheduledNotificationAsync(id);
      const futureNotifs = store.getState().notif.futureNotifs;
      const newFuture = [];
      for (let ix = 0; ix < futureNotifs.length; ++ix) {
        if (futureNotifs[ix].id !== id) {
          newFuture.push(futureNotifs[ix]);
        }
      }
      store.dispatch(setFutureNotifs(newFuture));
      return result;
    } catch (err) {
      throw Error(err);
    }
  }

  // cancels the most recently scheduled notification of a certain type
  async cancelSingleNotificationByType(type: NotifType) {
    const futureNotifs = store.getState().notif.futureNotifs;
    const newFuture = [];
    let hasRemoved = false;
    let removingId: ReactText = "";
    for (let ix = futureNotifs.length - 1; ix >= 0; --ix) {
      if (futureNotifs[ix].nativeNotif.data.type !== type || hasRemoved) {
        newFuture.push(futureNotifs[ix]);
      } else {
        removingId = futureNotifs[ix].id;
        hasRemoved = true;
      }
    }
    newFuture.reverse();
    try {
      const result = await Notifications.cancelScheduledNotificationAsync(
        removingId
      );
      store.dispatch(setFutureNotifs(newFuture));
      return result;
    } catch (err) {
      throw Error(err);
    }
  }

  async cancelAllNotificationsByType(type: NotifType) {
    const futureNotifs = store.getState().notif.futureNotifs;
    const newFuture = [];
    const removingIds = [];
    for (let ix = 0; ix < futureNotifs.length; ++ix) {
      if (futureNotifs[ix].nativeNotif.data.type !== type) {
        newFuture.push(futureNotifs[ix]);
      } else {
        removingIds.push(futureNotifs[ix].id);
      }
    }
    try {
      let result;
      for (let jx = 0; jx < removingIds.length; ++jx) {
        result = await Notifications.cancelScheduledNotificationAsync(
          removingIds[jx]
        );
      }
      store.dispatch(setFutureNotifs(newFuture));
      return result;
    } catch (err) {
      throw Error(err);
    }
  }

  async cancelAllNotifications() {
    try {
      const result = await Notifications.cancelAllScheduledNotificationsAsync();
      store.dispatch(setFutureNotifs([]));
      return result;
    } catch (err) {
      throw Error(err);
    }
  }
}

const Notifs = new NotifsBase();

export default Notifs;

import React from "react";
import {
  Alert,
  Platform,
  Vibration,
  PushNotificationIOS,
  View,
} from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { Notification } from "expo/build/Notifications/Notifications.types";
import { navigate } from "@navigations";
import { loadToken } from "@api";
import store from "@store";
import { addNotif, handleNotif } from "@store/Notif/NotifiActions";

class NotifsBase {
  private expoPushToken = "";
  private notificationSubscription: any;

  constructor() {
    this.notifHandler = this.notifHandler.bind(this);
    this.subscribe();
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

  setup() {
    this.registerForPushNotifications();
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
    }
    if (finalStatus !== "granted") return;
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

  async notifHandler(notification: Notification) {
    const notif = notification.data;
    console.log(notif);
    store.dispatch(addNotif(notif));
    switch (notif.type) {
      case "first_letter":
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
}

const Notifs = new NotifsBase();

export default Notifs;

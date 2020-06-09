import React, { useEffect }from "react";
import { Image, View, StyleSheet, NativeModules, Platform } from "react-native";
const AmeelioLogo = require("@assets/Ameelio_Logo.png");
import { i18n } from "@i18n";

const SplashScreen: React.FC = () => {
  useEffect(() => {
    const locale = getDeviceLocale();
    i18n.locale = locale;
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Image
        style={{ height: 120, aspectRatio: 2015 / 885 }}
        source={AmeelioLogo}
        accessibilityLabel="AmeelioLogo"
      />
    </View>
  );
};

const getDeviceLocale = () => {
  // returns locale in format of "en_US" (eng.) or "es_US" (sp.)
  const locale = Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale
    : NativeModules.I18nManager.localeIdentifier;
  return locale.substring(0, 2);
}

export default SplashScreen;

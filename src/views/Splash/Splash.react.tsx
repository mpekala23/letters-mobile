import React from "react";
import { Image, View, StyleSheet } from "react-native";
const AmeelioLogo = require("@assets/Ameelio_Logo.png");

const SplashScreen: React.FC = () => {
  return (
    <View
      accessible={false}
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
        accessible
        accessibilityLabel="Ameelio Logo"
      />
    </View>
  );
};

export default SplashScreen;

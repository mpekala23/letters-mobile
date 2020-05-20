import React from "react";
import { connect } from "redux-store";
import { AppState } from "@store/types";
import Styles from "./Topbar.styles";
import { View, Image } from "react-native";

const AmeelioLogo = require("@assets/Ameelio_Logo.png");

const Topbar: React.FC = () => {
  return (
    <View style={Styles.barContainer}>
      <View sylte={Styles.logoContainer}>
        <Image style={Styles.logo} source={AmeelioLogo} />
      </View>
      <View></View>
    </View>
  );
};

export default Topbar;

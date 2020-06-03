import React from "react";
import { connect } from "react-redux";
import { AppState } from "@store/types";
import Styles from "./Topbar.styles";
import { View, Image } from "react-native";
import ProfilePic from "../ProfilePic/ProfilePic.react";

const AmeelioLogo = require("@assets/Ameelio_Logo.png");

const Topbar: React.FC = () => {
  return (
    <View style={Styles.barContainer}>
      <View style={Styles.logoContainer}>
        <Image style={Styles.logo} source={AmeelioLogo} />
      </View>
      <View>
        <ProfilePic />
      </View>
    </View>
  );
};

export default Topbar;

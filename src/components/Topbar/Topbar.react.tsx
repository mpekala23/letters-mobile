import React from "react";
import { connect } from "react-redux";
import { AppState } from "@store/types";
import Styles from "./Topbar.styles";
import { View, Image } from "react-native";
import ProfilePic from "../ProfilePic/ProfilePic.react";
import { ProfilePicTypes } from "types";

const AmeelioLogo = require("@assets/Ameelio_Logo.png");

export interface Props {
  userState: UserState;
}

const TopbarBase: React.FC<Props> = (props) => {
  const profilePic = props.userState.authInfo.isLoggedIn ?
    <ProfilePic 
      first_name={props.userState.user.firstName}
      last_name={props.userState.user.lastName}
      imageUri={props.userState.user.imageUri}
      type={ProfilePicTypes.TopbarProfile}
    /> :
    <View testID="blank"></View>;
  return (
    <View style={Styles.barContainer}>
      <View style={Styles.logoContainer}>
        <Image style={Styles.logo} source={AmeelioLogo} />
      </View>
      <View>
        {profilePic}
      </View>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  userState: state.user,
});
const Topbar = connect(mapStateToProps)(TopbarBase);

export default Topbar;

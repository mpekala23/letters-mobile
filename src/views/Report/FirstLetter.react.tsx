import React, { useCallback, Dispatch } from "react";
import { Text, View } from "react-native";
import { Colors, Typography } from "@styles";
import { Button, Svg } from "@components";
import Mail from "assets/views/Report/MailLoud";
import Styles from "./FirstLetter.styles";
import ReportStyles from "./Report.styles";
import { useFocusEffect } from "@react-navigation/native";
import { AppState } from "@store/types";
import { connect } from "react-redux";
import { handleNotif } from "@store/Notif/NotifiActions";
import { NotifActionTypes, Notif } from "@store/Notif/NotifTypes";
import { AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";

type FirstLetterScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "FirstLetter"
>;

interface Props {
  currentNotif: Notif | null;
  handleNotif: () => void;
  navigation: FirstLetterScreenNavigationProp;
}

const FirstLetterScreenBase: React.FC<Props> = (props) => {
  useFocusEffect(
    useCallback(() => {
      if (props.currentNotif && props.currentNotif.screen === "FirstLetter")
        props.handleNotif();
    }, [])
  );

  return (
    <View style={Styles.background}>
      <View style={Styles.innerBack}>
        <Typography.ReportQuestion text="How was your first letter?" />
        <Svg svg={Mail} style={{ marginVertical: 30, left: 14 }} />
        <Text
          style={[
            Typography.FONT_REGULAR,
            {
              fontSize: 16,
              textAlign: "center",
              color: "#515151",
              marginHorizontal: 20,
              marginBottom: 30,
            },
          ]}
        >
          If there was a problem with delivery and your loved one didn't receive
          the letter, let us know.
        </Text>
        <Button
          buttonText="It was fire"
          onPress={() => {
            props.navigation.navigate("Home");
          }}
          containerStyle={{ width: "100%" }}
        />
        <Button
          buttonText="Something went wrong"
          onPress={() => {
            props.navigation.navigate("Issues");
          }}
          containerStyle={{ width: "100%" }}
          reverse
        />
      </View>
    </View>
  );
};

const mapStateToProps = function (state: AppState) {
  return {
    currentNotif: state.notif.currentNotif,
  };
};

const mapDispatchToProps = function (dispatch: Dispatch<NotifActionTypes>) {
  return {
    handleNotif: () => dispatch(handleNotif()),
  };
};

const FirstLetterScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstLetterScreenBase);

export default FirstLetterScreen;

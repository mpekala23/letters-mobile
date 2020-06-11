import React, { useCallback, Dispatch } from "react";
import { Text, View } from "react-native";
import { Colors, Typography } from "@styles";
import { Button, Icon } from "@components";
import Mail from "@assets/views/Report/MailLoud";
import Styles from "./FirstLetter.styles";
import ReportStyles from "./Report.styles";
import { useFocusEffect } from "@react-navigation/native";
import { AppState } from "@store/types";
import { connect } from "react-redux";
import { handleNotif } from "@store/Notif/NotifiActions";
import { NotifActionTypes, Notif, HANDLE_NOTIF } from "@store/Notif/NotifTypes";
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

class FirstLetterScreenBase extends React.Component<Props> {
  componentDidMount() {
    if (
      this.props.currentNotif &&
      this.props.currentNotif.screen === "FirstLetter"
    )
      this.props.handleNotif();
  }

  render() {
    return (
      <View style={Styles.background}>
        <View style={Styles.innerBack}>
          <Typography.ReportQuestion text="How was your first letter?" />
          <Icon svg={Mail} style={{ marginVertical: 30, left: 14 }} />
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
            If there was a problem with delivery and your loved one didn't
            receive the letter, let us know.
          </Text>
          <Button
            buttonText="It was fire"
            onPress={() => {
              this.props.navigation.navigate("Home");
            }}
            containerStyle={{ width: "100%" }}
          />
          <Button
            buttonText="Something went wrong"
            onPress={() => {
              this.props.navigation.navigate("Issues");
            }}
            containerStyle={{ width: "100%" }}
            reverse
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = function (state: AppState) {
  return {
    currentNotif: state.notif.currentNotif,
  };
};

const mapDispatchToProps = function (dispatch: Dispatch<NotifActionTypes>) {
  return {
    handleNotif: () => dispatch({ type: HANDLE_NOTIF, payload: null }),
  };
};

const FirstLetterScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstLetterScreenBase);

export { FirstLetterScreenBase };
export default FirstLetterScreen;

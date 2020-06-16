import React, { useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import { Notif } from "@store/Notif/NotifTypes";
import { useFocusEffect } from "@react-navigation/native";
import { AppState } from "store/types";
import { connect } from "react-redux";
import { AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";
import Notifs from "@notifications";
import { Input, Button } from "components";
import { Validation } from "utils";

type HomeScreenNavigationProp = StackNavigationProp<AppStackParamList, "Home">;

interface Props {
  currentNotif: Notif | null;
  navigation: HomeScreenNavigationProp;
}

const HomeScreenBase: React.FC<Props> = (props) => {
  // runs only on the first render
  useEffect(() => {
    async function doSetup() {
      await Notifs.setup();
    }
    doSetup();
  }, []);

  // runs when the screen is focused with a new current notification
  useFocusEffect(
    useCallback(() => {
      if (props.currentNotif && props.currentNotif.screen) {
        props.navigation.navigate(props.currentNotif.screen);
      }
    }, [props.currentNotif])
  );

  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={Keyboard.dismiss}
      style={{ backgroundColor: "white", flex: 1, padding: 10 }}
    >
      <Text>Hello</Text>
      <Button buttonText="Press Me" onPress={() => {}} />
      <Input
        required
        validate={Validation.CreditCard}
        placeholder="placeholder"
        height={300}
      />
    </TouchableOpacity>
  );
};

const mapStateToProps = function (state: AppState) {
  return {
    currentNotif: state.notif.currentNotif,
  };
};

const HomeScreen = connect(mapStateToProps)(HomeScreenBase);

export default HomeScreen;

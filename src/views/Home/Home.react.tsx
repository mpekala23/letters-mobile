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
import { ScrollView } from "react-native-gesture-handler";

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
      <ScrollView>
        <Input placeholder="Placeholder" />
        <Input placeholder="Placeholder" />
        <Input required placeholder="Placeholder" />
        <Input required validate={Validation.Cell} placeholder="Phone" />
        <Input
          required
          validate={Validation.Password}
          secure
          placeholder="Password"
        />
        <Input
          required
          validate={Validation.CreditCard}
          placeholder="0000 0000 0000 0000"
        />
        <Input placeholder="Placeholder" height={200} numLines={100} />
      </ScrollView>
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

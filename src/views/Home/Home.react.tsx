import React, { useCallback, useEffect } from "react";
import { View, Text, Linking } from "react-native";
import { Button } from "@components";
import { Notif, NotifType } from "@store/Notif/NotifTypes";
import { useFocusEffect } from "@react-navigation/native";
import { AppState } from "store/types";
import { connect } from "react-redux";
import { RootStackParamList, AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";
import Notifs from "@notifications";

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
      Notifs.purgeFutureNotifs();
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
    <View>
      <Text>Hello</Text>
    </View>
  );
};

const mapStateToProps = function (state: AppState) {
  return {
    currentNotif: state.notif.currentNotif,
  };
};

const HomeScreen = connect(mapStateToProps)(HomeScreenBase);

export default HomeScreen;

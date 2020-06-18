import React, { useCallback, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Notif } from "@store/Notif/NotifTypes";
import { useFocusEffect } from "@react-navigation/native";
import { AppState } from "store/types";
import { connect } from "react-redux";
import { AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";
import Notifs from "@notifications";
import { Button } from "@components";

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
    <View style={{ flex: 1 }}>
      <Text>Hello</Text>
      <Button buttonText="Press Me" onPress={() => {}} />
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

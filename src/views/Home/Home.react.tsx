import React, { useCallback } from "react";
import { View, Text } from "react-native";
import { Button } from "@components";
import { Notif } from "@store/Notif/NotifTypes";
import { useFocusEffect } from "@react-navigation/native";
import { AppState } from "store/types";
import { connect } from "react-redux";
import { RootStackParamList, AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";

type HomeScreenNavigationProp = StackNavigationProp<AppStackParamList, "Home">;

interface Props {
  currentNotif: Notif | null;
  navigation: HomeScreenNavigationProp;
}

const HomeScreenBase: React.FC<Props> = (props) => {
  useFocusEffect(
    useCallback(() => {
      if (props.currentNotif && props.currentNotif.screen) {
        props.navigation.navigate(props.currentNotif.screen);
      }
    }, [])
  );

  return (
    <View>
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

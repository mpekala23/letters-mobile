import React, { useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Notif } from '@store/Notif/NotifTypes';
import { useFocusEffect } from '@react-navigation/native';
import { AppState } from 'store/types';
import { connect } from 'react-redux';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import Notifs from '@notifications';
import { Button } from '@components';
import { popupAlert } from '@components/Alert/Alert.react';

type HomeScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Home'>;

interface Props {
  currentNotif: Notif | null;
  navigation: HomeScreenNavigationProp;
}

const HomeScreenBase: React.FC<Props> = (props: Props) => {
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
      <Button
        buttonText="popup"
        onPress={() => {
          popupAlert({
            title: 'You have a letter in progress',
            message: 'Continue writing and send that letter to your loved one',
            buttons: [
              {
                text: 'Continue writing',
                reverse: false,
                onPress: () => null,
              },
              {
                text: 'Start new letter',
                reverse: true,
                onPress: () => null,
              },
            ],
          });
        }}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    currentNotif: state.notif.currentNotif,
  };
};

const HomeScreen = connect(mapStateToProps)(HomeScreenBase);

export default HomeScreen;

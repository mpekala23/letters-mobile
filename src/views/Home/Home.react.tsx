import React, { useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Notif } from '@store/Notif/NotifTypes';
import { useFocusEffect } from '@react-navigation/native';
import { AppState } from '@store/types';
import { connect } from 'react-redux';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import Notifs from '@notifications';
import { Button, Input } from '@components';
import { STATES_DROPDOWN, Validation } from '@utils';

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
    <View style={{ flex: 1, padding: 16 }}>
      <Button
        buttonText="View Contact List"
        onPress={() => props.navigation.navigate('ContactSelector')}
        containerStyle={{ margin: 16 }}
      />
      <Input
        parentStyle={{
          marginBottom: 8,
          width: '100%',
          backgroundColor: 'white',
        }}
        placeholder="State"
        validate={Validation.State}
        options={STATES_DROPDOWN}
      />
      <Input
        parentStyle={{
          marginBottom: 8,
          width: '100%',
          backgroundColor: 'white',
        }}
        placeholder="State"
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

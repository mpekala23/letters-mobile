import React, { useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Notif } from '@store/Notif/NotifTypes';
import { useFocusEffect } from '@react-navigation/native';
import { AppState } from '@store/types';
import { connect } from 'react-redux';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import Notifs from '@notifications';
import { Button } from '@components';
import { Typography } from '@styles';

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
      <Text style={[Typography.FONT_LIGHT, { fontSize: 24 }]}>
        Light Font Style
      </Text>
      <Text style={[Typography.FONT_LIGHT_ITALIC, { fontSize: 24 }]}>
        Light Font Style (Italics)
      </Text>
      <Text style={[Typography.FONT_REGULAR, { fontSize: 24 }]}>
        Regular Font Style
      </Text>
      <Text style={[Typography.FONT_REGULAR_ITALIC, { fontSize: 24 }]}>
        Regular Font Style (Italics)
      </Text>
      <Text style={[Typography.FONT_MEDIUM, { fontSize: 24 }]}>
        Medium Font Style
      </Text>
      <Text style={[Typography.FONT_MEDIUM_ITALIC, { fontSize: 24 }]}>
        Medium Font Style (Italics)
      </Text>
      <Text style={[Typography.FONT_BOLD, { fontSize: 24 }]}>
        Bold Font Style
      </Text>
      <Text style={[Typography.FONT_BOLD_ITALIC, { fontSize: 24 }]}>
        Bold Font Style (Italics)
      </Text>
      <Button
        buttonText="View Contacts List"
        onPress={() => {
          props.navigation.navigate('ContactSelector');
        }}
      />
      <Button
        buttonText="Update Profile"
        onPress={() => {
          props.navigation.navigate('UpdateProfile');
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

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { getContacts, getLetters } from '@api';
import { Icon } from '@components';
import AmeelioBirdPink from '@assets/AmeelioBirdPink';
import Notifs from '@notifications';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import i18n from '@i18n';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';

type SetupScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Setup'
>;

interface Props {
  navigation: SetupScreenNavigationProp;
}

// screen that is hit after authentication, to setup notifs and do things like load user contacts and letters
const SetupScreen: React.FC<Props> = (props: Props) => {
  // runs only on the first render
  useEffect(() => {
    async function doSetup() {
      try {
        await Notifs.setup();
      } catch (err) {
        dropdownError({ message: i18n.t('Permission.notifs') });
      }
      try {
        await Promise.all([getContacts(), getLetters()]);
      } catch (err) {
        dropdownError({ message: i18n.t('Error.loadingUser') });
      }
      props.navigation.replace('Home');
    }
    doSetup();
  }, []);

  return (
    <View
      accessible={false}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <View accessible accessibilityLabel="Ameelio Logo">
        <Icon svg={AmeelioBirdPink} style={{ padding: 80 }} />
      </View>
    </View>
  );
};

export default SetupScreen;

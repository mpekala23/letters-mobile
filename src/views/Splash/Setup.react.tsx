import React, { useEffect, useState } from 'react';
import { View, Animated } from 'react-native';
import { getContacts, getLetters, uploadPushToken } from '@api';
import Notifs from '@notifications';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import i18n from '@i18n';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import store from '@store';
import { handleNotif } from '@store/Notif/NotifiActions';
import PinkLogoIcon from '@assets/views/Setup/PinkLogoIcon.png';

type SetupScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Setup'
>;

interface Props {
  navigation: SetupScreenNavigationProp;
  isLoggedIn: boolean;
}

// screen that is hit after authentication, to setup notifs and do things like load user contacts and letters
const SetupScreen: React.FC<Props> = (props: Props) => {
  const [loadingProgress] = useState<Animated.Value>(new Animated.Value(0));
  // runs only on the first render
  useEffect(() => {
    async function doSetup() {
      if (!store.getState().user.authInfo.isLoggedIn) return;
      try {
        await Notifs.setup();
        store.dispatch(handleNotif());
        await uploadPushToken(Notifs.getToken());
      } catch (err) {
        dropdownError({ message: i18n.t('Permission.notifs') });
      }
      try {
        await Promise.all([getContacts(), getLetters()]);
      } catch (err) {
        dropdownError({ message: i18n.t('Error.loadingUser') });
      }
      if (store.getState().contact.existing.length === 0) {
        props.navigation.replace('ContactInfo', {});
      } else {
        props.navigation.replace('ContactSelector');
      }
    }
    doSetup();
    Animated.timing(loadingProgress, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: true,
      delay: 400,
    }).start();
  }, []);

  const imageScale = {
    transform: [
      {
        scale: loadingProgress.interpolate({
          inputRange: [0, 15, 100],
          outputRange: [0.1, 0.06, 16],
        }),
      },
    ],
  };

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
      {/* <Animated.Image accessible accessibilityLabel="Ameelio Logo"> */}
      <Animated.Image
        accessible
        accessibilityLabel="Ameelio Logo"
        source={PinkLogoIcon}
        style={[imageScale]}
      />
    </View>
  );
};

export default SetupScreen;

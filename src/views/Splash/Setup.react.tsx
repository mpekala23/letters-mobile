import React from 'react';
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
import { AppState } from '@store/types';
import { connect } from 'react-redux';

type SetupScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Setup'
>;

interface Props {
  navigation: SetupScreenNavigationProp;
  numContacts: number;
}

interface State {
  loadingProgress: Animated.Value;
}

// screen that is hit after authentication, to setup notifs and do things like load user contacts and letters
class SetupScreenBase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingProgress: new Animated.Value(0),
    };
  }

  async componentDidMount(): Promise<void> {
    Animated.timing(this.state.loadingProgress, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: true,
      delay: 600,
    }).start();
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
    if (this.props.numContacts === 0) {
      this.props.navigation.replace('ContactInfo', {});
    } else {
      this.props.navigation.replace('ContactSelector');
    }
  }

  render(): JSX.Element {
    const imageScale = {
      transform: [
        {
          scale: this.state.loadingProgress.interpolate({
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
        <Animated.Image
          accessible
          accessibilityLabel="Ameelio Logo"
          source={PinkLogoIcon}
          style={[imageScale]}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  numContacts: state.contact.existing.length,
});

export default connect(mapStateToProps)(SetupScreenBase);

import React from 'react';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { Button, ProfilePic } from '@components';
import { facebookShare } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { Typography } from '@styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import i18n from '@i18n';
import { Contact } from '@store/Contact/ContactTypes';
import { ProfilePicTypes } from 'types';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import AirplaneIcon from '@assets/views/ReferFriends/Airplane';
import Icon from '@components/Icon/Icon.react';
import Styles from './ReferFriends.style';

type ReferFriendsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReferFriends'
>;

export interface Props {
  navigation: ReferFriendsScreenNavigationProp;
  contact: Contact;
}

const onShare = async () => {
  const ameelioUrl = 'letters.ameelio.org';
  const sharingUrl = `https://www.facebook.com/sharer/sharer.php?u=${ameelioUrl}`;
  try {
    await facebookShare(sharingUrl);
  } catch (err) {
    dropdownError({ message: i18n.t('Error.requestIncomplete') });
  }
};

const ReferFriendsScreenBase: React.FC<Props> = (props: Props) => {
  const { contact } = props;
  return (
    <KeyboardAvoidingView
      style={Styles.trueBackground}
      behavior="padding"
      enabled
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon
          svg={AirplaneIcon}
          style={{ position: 'absolute', top: -5, left: 52, zIndex: 999 }}
        />
        <ProfilePic
          firstName={contact.firstName}
          lastName={contact.lastName}
          imageUri="ExamplePic"
          type={ProfilePicTypes.SingleContact}
        />
        <Text
          style={[
            Typography.FONT_BOLD,
            { fontSize: 23, marginVertical: 12, textAlign: 'center' },
          ]}
        >
          {i18n.t('ReferFriendsScreen.yourLetterIsOnTheWay')}
        </Text>
        <Text
          style={[
            Typography.FONT_REGULAR,
            { marginBottom: 175, textAlign: 'center' },
          ]}
        >
          {/* TO-DO: Add in estimated delivery date after API integration */}
          {i18n.t('ReferFriendsScreen.yourLetterIsEstimatedToArrive')}.{' '}
          {i18n.t('ReferFriendsScreen.thanksAgain')}
        </Text>
        <Button
          buttonText={i18n.t('ReferFriendsScreen.shareOnFacebook')}
          onPress={() => onShare()}
          containerStyle={{ width: '100%' }}
        />
        <Button
          buttonText={i18n.t('ReferFriendsScreen.done')}
          reverse
          onPress={() => props.navigation.navigate('SingleContact')}
          containerStyle={{ width: '100%' }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    contact: state.contact.active,
  };
};

const ReferFriendsScreen = connect(mapStateToProps)(ReferFriendsScreenBase);

export default ReferFriendsScreen;

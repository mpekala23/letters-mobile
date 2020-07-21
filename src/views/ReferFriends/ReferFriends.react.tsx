import React from 'react';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { Button } from '@components';
import { facebookShare } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { Colors, Typography } from '@styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import i18n from '@i18n';
import Icon from '@components/Icon/Icon.react';
import Mailbox from '@assets/views/ReferFriends/Mailbox';
import moment from 'moment';
import Styles from './ReferFriends.style';

type ReferFriendsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReferFriends'
>;

export interface Props {
  navigation: ReferFriendsScreenNavigationProp;
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

const ReferFriendsScreen: React.FC<Props> = (props: Props) => {
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
        <Icon svg={Mailbox} />
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
            {
              marginBottom: 130,
              textAlign: 'center',
              color: Colors.GRAY_DARK,
              fontSize: 14,
            },
          ]}
        >
          {i18n.t('ReferFriendsScreen.yourLetterIsEstimatedToArrive')}{' '}
          {moment(Date.now() + 1000 * 60 * 60 * 24 * 6).format('MMM DD, YYYY')}.{' '}
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
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'ContactSelector' }, { name: 'SingleContact' }],
            });
          }}
          containerStyle={{ width: '100%' }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ReferFriendsScreen;

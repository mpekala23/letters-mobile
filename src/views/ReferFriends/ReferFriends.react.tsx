import React, { RefObject } from 'react';
import { Alert, KeyboardAvoidingView, Text, View } from 'react-native';
import { Button } from '@components';
import { facebookShare } from '@api';
import { getDropdownRef } from '@components/Dropdown/Dropdown.react';
import DropdownAlert from 'react-native-dropdownalert';
import { Typography } from '@styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from 'navigations';
import Styles from './ReferFriends.style';

type ReferFriendsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReferFriends'
>;

export interface Props {
  navigation: ReferFriendsScreenNavigationProp;
  userName: string;
  deliveryDate: string;
}

const onShare = async (dropdownRef: RefObject<DropdownAlert>) => {
  const ameelioUrl = 'letters.ameelio.org';
  // TO-DO: Edit message content once we have the content copy
  const shareMessage = 'Insert share message';
  const sharingUrl = `https://www.facebook.com/sharer/sharer.php?u=${ameelioUrl}&quote=${shareMessage}`;
  try {
    await facebookShare(sharingUrl);
  } catch (err) {
    if (dropdownRef.current) {
      dropdownRef.current.alertWithType(
        'error',
        'Network Error',
        'The request could not be completed.'
      );
    }
  }
};

/**
A component for prompting users to refer friends to use Ameelio's services.
*/
const ReferFriendsScreen: React.FC<Props> = (props) => {
  const { userName, deliveryDate } = props;

  const dropdownRef = getDropdownRef();

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
        }}
      >
        {/* TO-DO: Add in image asset when finalized */}
        <Text
          style={[
            Typography.FONT_REGULAR,
            { marginBottom: 24, textAlign: 'center' },
          ]}
        >
          Estimated delivery date:
          <Text style={[Typography.FONT_BOLD]}>{deliveryDate}</Text>
        </Text>
        <Text
          style={[
            Typography.FONT_REGULAR,
            { marginBottom: 36, textAlign: 'center' },
          ]}
        >
          Your letter to
          {userName}
          is on the way! Thanks for trusting us to deliver your messages.
        </Text>
        <Text
          style={[
            Typography.FONT_BOLD,
            { marginBottom: 24, textAlign: 'center' },
          ]}
        >
          Do you know anyone that could benefit from Ameelio`&apos;`s free
          services?
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            buttonText="Skip"
            reverse
            containerStyle={{ width: 80 }}
            textStyle={{ fontSize: 16 }}
            onPress={() => props.navigation.navigate('Home')}
          />
          <Button
            buttonText="Share"
            containerStyle={{ width: 80 }}
            textStyle={{ fontSize: 16 }}
            onPress={() => onShare(dropdownRef)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ReferFriendsScreen;

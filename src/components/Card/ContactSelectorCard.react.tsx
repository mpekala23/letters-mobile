import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Typography } from '@styles';
import Emoji from 'react-native-emoji';
import i18n from '@i18n';
import { ProfilePicTypes, Letter } from 'types';
import CardStyles from './Card.styles';
import ProfilePic from '../ProfilePic/ProfilePic.react';

interface Props {
  firstName: string;
  lastName: string;
  letters?: Letter[];
  onPress: () => void;
  style?: ViewStyle;
}

const ContactSelectorCard: React.FC<Props> = (props: Props) => {
  return (
    <TouchableOpacity
      style={[CardStyles.cardBase, CardStyles.shadow, props.style]}
      onPress={props.onPress}
      testID="ContactSelectorCard"
    >
      <View style={[{ flex: 1, flexDirection: 'row' }]}>
        <View style={[{ paddingTop: 12 }]}>
          <ProfilePic
            firstName={props.firstName}
            lastName={props.lastName}
            imageUri="ExamplePic"
            type={ProfilePicTypes.Contact}
          />
        </View>
        <View style={[{ paddingLeft: 18 }]}>
          <Text style={[Typography.BASE_TITLE]}>{props.firstName}</Text>
          <Text style={[Typography.FONT_MEDIUM, { color: Colors.GRAY_DARK }]}>
            <Emoji name="love_letter" />{' '}
            {i18n.t('SingleContactScreen.received')}:{' '}
            {props.letters ? props.letters.length : 0}
          </Text>
          <Text style={[Typography.FONT_MEDIUM, { color: Colors.GRAY_DARK }]}>
            <Emoji name="calendar" />{' '}
            {i18n.t('SingleContactScreen.lastHeardFromYou')}:
          </Text>
          <Text
            style={[
              Typography.FONT_MEDIUM,
              { paddingBottom: 4, color: Colors.GRAY_DARK },
            ]}
          >
            <Emoji name="airplane" />{' '}
            {i18n.t('SingleContactScreen.lettersTraveled')}:
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ContactSelectorCard;

import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Typography } from '@styles';
import Emoji from 'react-native-emoji';
import i18n from '@i18n';
import { ProfilePicTypes, Letter } from 'types';
import { format } from 'date-fns';
import CardStyles from './Card.styles';
import ProfilePic from '../ProfilePic/ProfilePic.react';

interface Props {
  firstName: string;
  lastName: string;
  imageUri?: string;
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
            imageUri={props.imageUri}
            type={ProfilePicTypes.Contact}
          />
        </View>
        <View style={[{ paddingLeft: 18 }]}>
          <Text style={[Typography.BASE_TITLE]}>{props.firstName}</Text>
          <Text style={[Typography.FONT_REGULAR, { color: Colors.GRAY_DARK }]}>
            <Emoji name="love_letter" />{' '}
            {i18n.t('SingleContactScreen.received')}:{' '}
            {props.letters ? props.letters.length : 0}
          </Text>
          <Text style={[Typography.FONT_REGULAR, { color: Colors.GRAY_DARK }]}>
            <Emoji name="calendar" />{' '}
            {i18n.t('SingleContactScreen.lastHeardFromYou')}:{' '}
            {props.letters
              ? format(props.letters[0].dateCreated, 'MMM dd')
              : 'N/A'}
          </Text>
          <Text
            style={[
              Typography.FONT_REGULAR,
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

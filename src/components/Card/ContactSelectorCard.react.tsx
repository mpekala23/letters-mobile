import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Typography } from '@styles';
import Emoji from 'react-native-emoji';
import i18n from '@i18n';
import { ProfilePicTypes, Letter } from 'types';
import { format } from 'date-fns';
import { getZipcode } from '@api/Common';
import { haversine } from '@utils';
import CardStyles from './Card.styles';
import ProfilePic from '../ProfilePic/ProfilePic.react';

interface Props {
  firstName: string;
  lastName: string;
  imageUri?: string;
  letters?: Letter[];
  onPress: () => void;
  style?: ViewStyle;
  userPostal?: string;
  contactPostal?: string;
}

const ContactSelectorCard: React.FC<Props> = (props: Props) => {
  const [lettersTravelled, setLettersTravelled] = useState(0);

  useEffect(() => {
    const updateLettersTravelled = async (): Promise<void> => {
      try {
        if (props.userPostal && props.contactPostal && props.letters) {
          const loc1 = await getZipcode(props.userPostal);
          const loc2 = await getZipcode(props.contactPostal);
          setLettersTravelled(haversine(loc1, loc2) * props.letters.length);
        }
      } catch (err) {
        setLettersTravelled(0);
      }
    };
    updateLettersTravelled();
  }, [props.letters, props.userPostal, props.contactPostal]);

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
            {i18n.t('SingleContactScreen.lettersTraveled')}: {lettersTravelled}{' '}
            {i18n.t('ContactSelectorScreen.miles')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ContactSelectorCard;

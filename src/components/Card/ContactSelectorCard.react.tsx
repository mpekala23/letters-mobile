import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Typography } from '@styles';
import Emoji from 'react-native-emoji';
import i18n from '@i18n';
import { ProfilePicTypes, Mail, MailStatus } from 'types';
import { format } from 'date-fns';
import { getZipcode } from '@api/Common';
import { haversine } from '@utils';
import CardStyles from './Card.styles';
import ProfilePic from '../ProfilePic/ProfilePic.react';
import AdjustableText from '../Text/AdjustableText.react';

interface Props {
  firstName: string;
  lastName: string;
  imageUri?: string;
  mail?: Mail[];
  onPress: () => void;
  style?: ViewStyle;
  userPostal?: string;
  contactPostal?: string;
}

const ContactSelectorCard: React.FC<Props> = (props: Props) => {
  const [lettersTravelled, setLettersTravelled] = useState(0);

  const deliveredLetters = props.mail
    ? props.mail.filter((mail) => mail.status === MailStatus.Delivered)
    : [];

  const sentLetters = props.mail
    ? props.mail.filter((mail) => mail.status !== MailStatus.Draft)
    : [];

  useEffect(() => {
    const updateLettersTravelled = async (): Promise<void> => {
      try {
        if (props.userPostal && props.contactPostal && props.mail) {
          const loc1 = await getZipcode(props.userPostal);
          const loc2 = await getZipcode(props.contactPostal);
          setLettersTravelled(haversine(loc1, loc2) * deliveredLetters.length);
        }
      } catch (err) {
        setLettersTravelled(0);
      }
    };
    updateLettersTravelled();
  }, [props.mail, props.userPostal, props.contactPostal]);

  return (
    <TouchableOpacity
      style={[CardStyles.cardBase, CardStyles.shadow, props.style]}
      onPress={props.onPress}
      testID="ContactSelectorCard"
    >
      <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }]}>
        <View style={[{ paddingTop: 12 }]}>
          <ProfilePic
            firstName={props.firstName}
            lastName={props.lastName}
            imageUri={props.imageUri}
            type={ProfilePicTypes.Contact}
          />
        </View>
        <View style={{ paddingLeft: 18, flex: 1 }}>
          <Text style={[Typography.BASE_TITLE]}>{props.firstName}</Text>
          <AdjustableText
            style={[Typography.FONT_REGULAR, { color: Colors.GRAY_500 }]}
            numberOfLines={1}
          >
            <Emoji name="love_letter" /> {i18n.t('SingleContactScreen.sent')}:{' '}
            {props.mail ? sentLetters.length : 0}
          </AdjustableText>
          {props.mail && props.mail.length > 0 && props.mail[0].dateCreated && (
            <Text style={[Typography.FONT_REGULAR, { color: Colors.GRAY_500 }]}>
              <Emoji name="calendar" />
              {i18n.t('SingleContactScreen.lastHeardFromYou')}:{' '}
              {format(props.mail[0].dateCreated, 'MMM dd')}
            </Text>
          )}
          {lettersTravelled > 0 && (
            <Text
              style={[
                Typography.FONT_REGULAR,
                { paddingBottom: 4, color: Colors.GRAY_500 },
              ]}
            >
              <Emoji name="airplane" />{' '}
              {i18n.t('SingleContactScreen.lettersTraveled')}:{' '}
              {lettersTravelled} {i18n.t('ContactSelectorScreen.miles')}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

ContactSelectorCard.defaultProps = {
  imageUri: '',
  mail: [],
  style: {},
  userPostal: '',
  contactPostal: '',
};

export default ContactSelectorCard;

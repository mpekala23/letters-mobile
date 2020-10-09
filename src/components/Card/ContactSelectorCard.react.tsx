import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Typography } from '@styles';
import Emoji from 'react-native-emoji';
import i18n from '@i18n';
import { ProfilePicTypes, Mail, MailStatus } from 'types';
import { format } from 'date-fns';
import { getZipcode } from '@api/Common';
import { capitalize, haversine } from '@utils';
import CardStyles from './Card.styles';
import ProfilePic from '../ProfilePic/ProfilePic.react';
import AdjustableText from '../Text/AdjustableText.react';

interface Props {
  firstName: string;
  lastName: string;
  numSent: number;
  imageUri?: string;
  mail?: Mail[];
  onPress: () => void;
  userPostal?: string;
  contactPostal?: string;
  backgroundColor?: string;
}

const ContactSelectorCard: React.FC<Props> = (props: Props) => {
  const [lettersTravelled, setLettersTravelled] = useState(0);

  const deliveredLetters = props.mail
    ? props.mail.filter((mail) => mail.status === MailStatus.Delivered)
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
      style={[CardStyles.shadow, CardStyles.contactSelectorCardBackground]}
      onPress={props.onPress}
      testID="ContactSelectorCard"
    >
      <View
        style={[
          CardStyles.contactSelectorColor,
          { backgroundColor: props.backgroundColor },
        ]}
      />
      <View style={{ paddingTop: 16 }}>
        <ProfilePic
          firstName={props.firstName}
          lastName={props.lastName}
          imageUri={props.imageUri}
          type={ProfilePicTypes.Contact}
        />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <AdjustableText numberOfLines={1} style={[Typography.BASE_TITLE]}>
          {capitalize(props.firstName)} {capitalize(props.lastName)}
        </AdjustableText>
        <AdjustableText
          numberOfLines={1}
          style={[Typography.FONT_REGULAR, { color: Colors.GRAY_500 }]}
        >
          <Emoji name="calendar" />
          {i18n.t('ContactSelectorScreen.lastHeard')}:{' '}
          {props.mail && props.mail.length
            ? format(new Date(props.mail[0].dateCreated), 'MMM d')
            : 'N/A'}
        </AdjustableText>
        <AdjustableText
          style={[Typography.FONT_REGULAR, { color: Colors.GRAY_500 }]}
          numberOfLines={1}
        >
          <Emoji name="love_letter" /> {props.numSent}{' '}
          {props.numSent === 1
            ? i18n.t('ContactSelectorScreen.letter')
            : i18n.t('ContactSelectorScreen.letters')}
        </AdjustableText>
        {false && lettersTravelled > 0 && (
          <Text
            style={[
              Typography.FONT_REGULAR,
              { paddingBottom: 4, color: Colors.GRAY_500 },
            ]}
          >
            <Emoji name="airplane" />{' '}
            {i18n.t('SingleContactScreen.lettersTraveled')}: {lettersTravelled}{' '}
            {i18n.t('ContactSelectorScreen.miles')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

ContactSelectorCard.defaultProps = {
  imageUri: '',
  mail: [],
  userPostal: '',
  contactPostal: '',
  backgroundColor: Colors.BLUE_400,
};

export default ContactSelectorCard;

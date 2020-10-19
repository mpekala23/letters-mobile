import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '@styles';
import Emoji from 'react-native-emoji';
import i18n from '@i18n';
import { ProfilePicTypes, Mail, MailStatus } from 'types';
import { differenceInDays, format, formatDistance, subDays } from 'date-fns';
import { getZipcode } from '@api/Common';
import { capitalize, haversine } from '@utils';
import MemoryCardPlaceholder from '@components/Loaders/MemoryCardPlaceholder';
import ContactCardPlaceholder from '@components/Loaders/ContactCardPlaceholder';
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
  isLoadingMail: boolean;
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
          const [loc1, loc2] = await Promise.all([
            getZipcode(props.userPostal),
            getZipcode(props.contactPostal),
          ]);
          setLettersTravelled(haversine(loc1, loc2) * deliveredLetters.length);
        }
      } catch (err) {
        setLettersTravelled(0);
      }
    };
    updateLettersTravelled();
  }, [props.mail, props.userPostal, props.contactPostal]);

  const daysSinceLast =
    props.mail && props.mail.length
      ? Math.abs(
          differenceInDays(new Date(props.mail[0].dateCreated), new Date())
        )
      : null;

  let heardString;
  if (daysSinceLast && daysSinceLast <= 21) {
    heardString = formatDistance(
      subDays(new Date(), daysSinceLast),
      new Date()
    );
  } else if (props.mail && props.mail.length) {
    heardString = format(new Date(props.mail[0].dateCreated), 'MMM d');
  } else {
    heardString = 'N/A';
  }

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
        <AdjustableText
          numberOfLines={2}
          style={[Typography.BASE_TITLE, { textAlign: 'center', fontSize: 21 }]}
        >
          {capitalize(props.firstName)}
          {`\n`}
          {capitalize(props.lastName)}
        </AdjustableText>
        {props.isLoadingMail ? (
          <ContactCardPlaceholder />
        ) : (
          <View style={{ alignItems: 'center' }}>
            <AdjustableText
              numberOfLines={1}
              style={[Typography.FONT_REGULAR, { color: Colors.GRAY_400 }]}
            >
              <Emoji name="calendar" />{' '}
              {i18n.t('ContactSelectorScreen.lastHeard')}: {heardString}
            </AdjustableText>

            <AdjustableText
              style={[Typography.FONT_REGULAR, { color: Colors.GRAY_400 }]}
              numberOfLines={1}
            >
              <Emoji name="love_letter" /> {props.numSent}{' '}
              {props.numSent === 1
                ? i18n.t('ContactSelectorScreen.letter')
                : i18n.t('ContactSelectorScreen.letters')}
            </AdjustableText>
            {lettersTravelled > 0 && (
              <AdjustableText
                numberOfLines={1}
                style={[
                  Typography.FONT_REGULAR,
                  { paddingBottom: 4, color: Colors.GRAY_400 },
                ]}
              >
                <Emoji name="airplane" />{' '}
                {i18n.t('SingleContactScreen.lettersTraveled')}:{' '}
                {lettersTravelled} {i18n.t('ContactSelectorScreen.miles')}
              </AdjustableText>
            )}
          </View>
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

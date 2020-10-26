import React, { Dispatch, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { AppStackParamList, Screens } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { Mail, MailTypes, Contact, EntityTypes } from 'types';
import MemoryLaneCard from '@components/Card/MemoryLaneCard.react';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setActive as setActiveMail } from '@store/Mail/MailActions';
import i18n from '@i18n';
import { MailActionTypes } from '@store/Mail/MailTypes';
import * as Segment from 'expo-analytics-segment';
import { checkIfLoading } from '@store/selectors';
import MemoriesPlaceholder from '@components/Loaders/MemoriesPlaceholder';
import { getMailByContact } from '@api';
import * as Sentry from 'sentry-expo';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import Styles from './MemoryLane.styles';

type MemoryLaneScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'MemoryLane'
>;

interface Props {
  navigation: MemoryLaneScreenNavigationProp;
  contact: Contact;
  existingMail: Record<string, Mail[]>;
  setActiveMail: (mail: Mail) => void;
  isMailLoading: boolean;
}

const MemoryLaneScreenBase: React.FC<Props> = (props: Props) => {
  if (props.isMailLoading) return <MemoriesPlaceholder />;
  const [gettingMore, setGettingMore] = useState(false);

  const mail = props.existingMail[props.contact.id];

  return (
    <View style={Styles.background}>
      <FlatList
        data={mail}
        numColumns={2}
        contentContainerStyle={{ padding: 8, justifyContent: 'space-between' }}
        renderItem={({ item }) => {
          let imageUri = '';
          if (item.type === MailTypes.Letter && item.images.length)
            imageUri = item.images[0].uri;
          else if (item.type === MailTypes.Postcard)
            imageUri = item.design.asset.uri;
          return (
            <MemoryLaneCard
              type={item.type}
              key={item.id}
              text={item.content}
              date={new Date(item.dateCreated)}
              imageUri={imageUri}
              onPress={() => {
                props.setActiveMail(item);
                Segment.track('Memory Lane - Click on Memory Card');
                props.navigation.navigate(Screens.MailDetails);
              }}
              style={{ flex: 1, margin: 8 }}
            />
          );
        }}
        ListEmptyComponent={() => {
          return (
            <View style={{ alignItems: 'center' }}>
              <Text style={Styles.baseText}>
                {i18n.t('MemoryLaneScreen.youDoNotHaveLettersYet')}
              </Text>
              <Text style={Styles.baseText}>
                {' '}
                {i18n.t('MemoryLaneScreen.goSendYourFirstLetter')}
              </Text>
            </View>
          );
        }}
        keyExtractor={(item, index) => item.id.toString() + index.toString()}
        onEndReached={async () => {
          if (gettingMore || !props.contact.hasNextPage) return;
          setGettingMore(true);
          try {
            await getMailByContact(props.contact, props.contact.mailPage);
          } catch (err) {
            Sentry.captureException(err);
            dropdownError({
              message: i18n.t('Error.cantRefreshLetters'),
            });
          }
          setGettingMore(false);
        }}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    contact: state.contact.active,
    existingMail: state.mail.existing,
    isMailLoading: checkIfLoading(state, EntityTypes.Mail),
  };
};
const mapDispatchToProps = (dispatch: Dispatch<MailActionTypes>) => {
  return {
    setActiveMail: (mail: Mail) => dispatch(setActiveMail(mail)),
  };
};

const MemoryLaneScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MemoryLaneScreenBase);

export default MemoryLaneScreen;

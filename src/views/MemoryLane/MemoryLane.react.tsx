import React, { Dispatch } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Mail, MailTypes, Contact } from 'types';
import MemoryLaneCard from '@components/Card/MemoryLaneCard.react';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setActive as setActiveMail } from '@store/Mail/MailActions';
import i18n from '@i18n';
import { MailActionTypes } from '@store/Mail/MailTypes';
import * as Segment from 'expo-analytics-segment';
import Styles from './MemoryLane.styles';

type MemoryLaneScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'MemoryLane'
>;

interface Props {
  navigation: MemoryLaneScreenNavigationProp;
  contact: Contact;
  existingMail: Record<number, Mail[]>;
  setActiveMail: (mail: Mail) => void;
}

const MemoryLaneScreenBase: React.FC<Props> = (props: Props) => {
  const mail = props.existingMail[props.contact.id];
  const memoryCards =
    mail && mail.length > 0 ? (
      mail.map((item: Mail) => {
        let imageUri = '';
        if (item.type === MailTypes.Letter && item.image)
          imageUri = item.image.uri;
        else if (item.type === MailTypes.Postcard)
          imageUri = item.design.image.uri;
        return (
          <MemoryLaneCard
            type={item.type}
            key={item.id}
            text={item.content}
            date={item.dateCreated}
            imageUri={imageUri}
            onPress={() => {
              props.setActiveMail(item);
              Segment.track('Memory Lane - Click on Memory Card');
              props.navigation.navigate('MailDetails');
            }}
            style={{ width: '45%', marginLeft: 6 }}
          />
        );
      })
    ) : (
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

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: '#EDEDED' }}
    >
      <View
        style={
          mail && mail.length > 0
            ? Styles.cardsBackground
            : Styles.textBackground
        }
      >
        {memoryCards}
      </View>
    </ScrollView>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    contact: state.contact.active,
    existingMail: state.mail.existing,
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

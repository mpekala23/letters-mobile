import { Button } from '@components';
import i18n from '@i18n';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import React from 'react';
import { View, Text, Image as ImageComponent } from 'react-native';
import { connect } from 'react-redux';
import * as Segment from 'expo-analytics-segment';
import { AppState } from '@store/types';
import Community from '@assets/views/AddContact/Community.png';
import { Typography } from '@styles';
import Styles from './IntroContact.styles';

type ContactSelectorScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.IntroContact
>;

interface Props {
  userName: string;
  navigation: ContactSelectorScreenNavigationProp;
}

const IntroContact = ({ userName, navigation }: Props) => {
  return (
    <View style={Styles.mainBackground}>
      <Text style={[Typography.FONT_BOLD, Styles.titleText]}>
        {i18n.t('IntroContactScreen.welcomePre')} {userName}!{' '}
        {i18n.t('IntroContactScreen.welcomePost')}
      </Text>
      <Text style={Styles.bodyText}>{i18n.t('IntroContactScreen.body')}</Text>
      <ImageComponent source={Community} style={Styles.imageStyle} />
      <Button
        containerStyle={{ marginTop: 'auto' }}
        buttonText={i18n.t('IntroContactScreen.continueButton')}
        textStyle={[Typography.FONT_SEMIBOLD]}
        onPress={() => {
          navigation.navigate(Screens.ContactInfo, {});
          Segment.track('Add Contact - Begin');
        }}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  userName: state.user.user.firstName,
});

const IntroContactScreen = connect(mapStateToProps)(IntroContact);

export default IntroContactScreen;

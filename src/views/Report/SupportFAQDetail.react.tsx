import React from 'react';
import { Text, View } from 'react-native';
import { Typography } from '@styles';
import { Button } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@i18n';
import Styles from './SupportFAQ.styles';

type SupportFAQDetailScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'SupportFAQ'
>;

interface Props {
  navigation: SupportFAQDetailScreenNavigationProp;
}

const SupportFAQDetailScreen: React.FC<Props> = () => {
  return (
    <View style={Styles.trueBackground}>
      <Text style={[Typography.FONT_BOLD, Styles.headerText]}>
        {i18n.t('SupportFAQDetailScreen.talkToSomeoneAtAmeelio')}
      </Text>
      <Text style={Styles.baseText}>
        {i18n.t('SupportFAQDetailScreen.messageUsOnFacebook')}
      </Text>
      <Button
        onPress={() => {
          /* TO-DO: Navigate to Ameelio's Facebook */
        }}
        buttonText={i18n.t('SupportFAQDetailScreen.talkToSomeoneOnFacebook')}
        textStyle={{ fontSize: 18 }}
        containerStyle={Styles.needHelpButton}
      />
    </View>
  );
};

export default SupportFAQDetailScreen;

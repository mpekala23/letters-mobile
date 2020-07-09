import React from 'react';
import { ScrollView, Text } from 'react-native';
import i18n from '@i18n';
import { AuthStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Typography } from '@styles';

type TermsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Terms'
>;

interface Props {
  navigation: TermsScreenNavigationProp;
}
const TermsScreen: React.FC<Props> = () => {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={[Typography.FONT_BOLD, { textAlign: 'center' }]}>
        {i18n.t('TermsScreen.ameelioTermsOfService')}
      </Text>
      <Text style={[Typography.FONT_BOLD, { textAlign: 'center' }]}>
        Effective Date: March 23, 2020
      </Text>
      <Text style={{ paddingVertical: 12 }}>
        Ameelio, Inc. (“Ameelio”, “Company”, “we”, “our”, and “us”) has created
        a communication service (collectively referred to as “Services”) to
        connect individuals who are incarcerated with the free world to improve
        the lives of those impacted by incarceration and reduce recidivism
        rates. Ameelio also researches and studies prisons and prison systems
        and institutions, the institutions of the criminal justice system, and
        criminal justice policies to understand the impact of incarceration.
      </Text>
      <Text style={{ paddingBottom: 12 }}>
        1. <Text style={Typography.FONT_BOLD}>Introduction.</Text>
        <Text>
          To assist you in using our Services, and to ensure a clear
          understanding of the relationship from your use of the Services, we
          have created these Terms of Services (the “Terms”). The Terms
          constitute a binding agreement between you and Ameelio. The Terms
          govern your use of the Services and any other services offered as part
          of the Ameelio platform. The Terms also governs any information, text,
          graphics, photos, recordings, or other materials uploaded, downloaded,
          or appearing on the Services (collectively referred to as “Content”).
        </Text>
      </Text>
      <Text>
        Our Terms and Privacy Policy apply to all “Free World Users,”
        “Incarcerated Persons,” and any casual visitor to our Services who is
        not a Free World User or Incarcerated Person. Together, the Free World
        Users, Incarcerated Persons, and visitors to the Ameelio site are all
        “Users.” The terms “you” and “your” includes anyone who uses the
        Services Ameelio offers. Unless otherwise indicated, all provisions of
        these Terms apply to all Users.
      </Text>
      {/* TO-DO: Continue adding text views here */}
    </ScrollView>
  );
};

export default TermsScreen;

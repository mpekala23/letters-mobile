import React from 'react';
import { Linking, ScrollView, Text } from 'react-native';
import { AuthStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Typography } from '@styles';

type PrivacyScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Privacy'
>;

export interface Props {
  navigation: PrivacyScreenNavigationProp;
}
const PrivacyScreen: React.FC<Props> = () => {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={[Typography.FONT_BOLD, { textAlign: 'center' }]}>
        Ameelio Privacy Policy
      </Text>
      <Text style={[Typography.FONT_BOLD, { textAlign: 'center' }]}>
        Effective Date: March 23, 2020
      </Text>
      <Text style={{ paddingVertical: 12 }}>
        {'\t'} 1. <Text style={Typography.FONT_BOLD}>Introduction. </Text>
        <Text>
          Ameelio, Inc.’s (“Ameelio”, “Company”, “we”, “our”, and “us”) mission
          is to improve the lives of those impacted by incarceration and provide
          a communication service that connects individuals who are incarcerated
          with the free world. Ameelio is committed to being transparent about
          how Ameelio uses information collected through Connect, Letters,
          Forum, and other related services (the “Services”).
        </Text>
      </Text>
      <Text style={{ paddingBottom: 12 }}>
        This privacy policy (the “Policy”) applies to our privacy practices for
        the handling of data submitted in connection with your use of our
        Services. This Policy describes the types of information we collect, how
        we may use or process that information, and with whom we can share it.
        This Policy also describes measures we take to protect the security of
        your personal information.
      </Text>
      <Text style={{ paddingBottom: 12 }}>
        {'\t'} 2.{' '}
        <Text style={Typography.FONT_BOLD}>Information Collected. </Text>
      </Text>
      <Text style={{ paddingBottom: 12 }}>
        {'\t'}{' '}
        <Text style={Typography.FONT_BOLD}>Information You Provide Us. </Text>
        <Text>
          When you use the Services, you will have an opportunity to provide us
          some information directly. For example, we may collect information
          when you register an account with us. Upon registration, we may ask
          you to provide information including your name, email address, and
          mailing address. We may also collect information from you in a
          completion survey or other communications with Ameelio.
        </Text>
      </Text>
      <Text style={{ paddingBottom: 12 }}>
        {'\t'}{' '}
        <Text style={Typography.FONT_BOLD}>
          Information We Automatically Collect.{' '}
        </Text>
        <Text>
          When you interact with the Services, we automatically collect some
          information from you. For example, Connect records and saves all calls
          made through the video call service. Data collected from the calls may
          include audio/video and biometric data (such as your voice).
          Similarly, when you use Letters, we may save the contents of the
          message. Additional information about your usage of Ameelio’s services
          may also be collected through a third party provider. This may
          include, but is not limited to, your IP address, phone number, and
          information about the pages you visit and the features you use.
        </Text>
      </Text>
      <Text style={{ paddingBottom: 12 }}>
        {'\t'}{' '}
        <Text style={Typography.FONT_BOLD}>
          Information Provided by Third Parties.{' '}
        </Text>
        <Text>
          In addition, we may collect information through other sources. For
          example, we may receive information from the Department of Corrections
          and various prisons and jails. This information may include
          information such as incarcerated persons’ names, date of
          incarceration, expected release date, identification number, housing
          facility name, demographic information, and sometimes calendar
          availability.
        </Text>
      </Text>
      <Text style={{ paddingVertical: 12 }}>
        {'\t'} 4.{' '}
        <Text style={Typography.FONT_BOLD}>Information We Disclose. </Text>
      </Text>
      <Text style={{ paddingBottom: 12 }}>
        {'\t'} Ameelio may disclose aggregated or de-identified information
        about our users without restriction. We may collect, use, and share this
        information for research purposes including, but not limited to,
        research on recidivism rates.
      </Text>
      <Text style={{ paddingBottom: 12 }}>
        Information you provide may also be shared with third parties in order
        to carry out our services. For example, if you type and submit a letter,
        we will work with our third party provider to print and send the letter.
        For more information about our services, please see the Terms of Service
        here.
      </Text>
      <Text style={{ paddingBottom: 12 }}>
        Please note that if you submit any of your personally identifiable
        information to a portion of Ameelio’s Services that is accessible by
        other users, including in an online forum, the public and other users
        will be able to see that information. Only include information in such
        submissions you are comfortable sharing with third parties or the
        general public.
      </Text>
      <Text style={{ paddingBottom: 12 }}>
        In order to provide our Services, we also may coordinate with and
        disclose information to state and federal prisons. We reserve the right
        to access, read, preserve, and disclose any information we believe is
        necessary to comply with lawful requests or enforce or apply our Terms
        of Service here and other agreements. We also reserve the right to
        access or disclose any information to protect the rights, property, or
        safety of Ameelio, our employees, our Users, or others.
      </Text>
      <Text style={{ paddingVertical: 12 }}>
        {'\t'} 5. <Text style={Typography.FONT_BOLD}>Data Security. </Text>
        <Text>
          We take care to implement reasonable measures designed to protect your
          personal information. The safety and security of your information also
          depends on you. Certain parts of our Services are protected by a
          password, and it is your responsibility to keep that password
          confidential.
        </Text>
      </Text>
      <Text style={{ paddingBottom: 12 }}>
        We endeavor to protect the privacy of your account and other personal
        information we hold in our records. However, no transmission of
        information via the internet is completely secure, and we cannot
        guarantee complete security. Unauthorized entry or use, hardware or
        software failure, and other factors may compromise the security of user
        information at any time. We assume no responsibility or liability if any
        information relating to you is intercepted or used by an unintended
        recipient.
      </Text>
      <Text style={{ paddingVertical: 12 }}>
        {'\t'} 6.{' '}
        <Text style={Typography.FONT_BOLD}>
          Modification and Retention of Information.{' '}
        </Text>
        <Text>
          You may access your name and account information through your account
          settings. The information you can view, update, and delete may change
          over time. Identifiable information provided to Ameelio will be kept
          as long as reasonably necessary for the legitimate business purposes,
          or as required by law (for example legal or accounting purposes),
          whichever is longer.
        </Text>
      </Text>
      <Text style={{ paddingBottom: 12 }}>
        Information that has been de-identified or is not personal information
        may be retained indefinitely and used for research or other purposes.
      </Text>
      <Text style={{ paddingVertical: 12 }}>
        {'\t'} 7. <Text style={Typography.FONT_BOLD}>Age of Users. </Text>
        <Text>
          If you are younger than 13, you may not use, access, or provide any
          content using our Services. If your age is 13 or older but under the
          age of 18, you may use our Services only under the supervision of a
          parent or legal guardian who agrees to be bound by the Terms of
          Service [LINK] and this Privacy Policy. If you are a parent or legal
          guardian agreeing to the Terms of Service of this Policy for the
          benefit of a child who is 13 or older but under the age of 18, you are
          fully responsible for the child’s use of the Services.
        </Text>
      </Text>
      <Text style={{ paddingVertical: 12 }}>
        {'\t'} 8.{' '}
        <Text style={Typography.FONT_BOLD}>California Privacy Rights. </Text>
        <Text>
          If you are a resident of California, California law may provide you
          additional rights to the use of your personal information. To learn
          more about your California privacy rights, visit the California
          Attorney General website{' '}
          <Text
            style={{ color: 'blue' }}
            onPress={() => Linking.openURL('oag.ca.gov/privacy/privacy-laws')}
          >
            here{' '}
          </Text>
          . Please contact us at{' '}
          <Text
            style={{ color: 'blue' }}
            onPress={() => Linking.openURL('mailto:team@ameelio.org')}
          >
            team@ameelio.org{' '}
          </Text>{' '}
          for more information.
        </Text>
      </Text>
      <Text style={{ paddingVertical: 12 }}>
        {'\t'} 9.{' '}
        <Text style={Typography.FONT_BOLD}>Changes to the Policy. </Text>
        <Text>
          We will post any changes we make to our Policy on this page. If we
          make material changes to how we treat User’s Personal Information, we
          will notify you through a notice on the Ameelio website homepage. The
          date the privacy policy was last revised is identified at the
          beginning of the Policy.
        </Text>
      </Text>
      <Text style={{ paddingVertical: 12 }}>
        {'\t'} 10.{' '}
        <Text style={Typography.FONT_BOLD}>Contact Information. </Text>
        <Text>
          For any questions about this Policy or our privacy practices, contact
          us at:{' '}
          <Text
            style={{ color: 'blue' }}
            onPress={() => Linking.openURL('mailto:team@ameelio.org')}
          >
            team@ameelio.org{' '}
          </Text>
          .
        </Text>
      </Text>
    </ScrollView>
  );
};

export default PrivacyScreen;

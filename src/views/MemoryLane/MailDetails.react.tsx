import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { AppStackParamList } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { Mail, MailTypes, MailStatus } from 'types';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { format } from 'date-fns';
import { Typography } from '@styles';
import { DisplayImage } from '@components';
import Styles from './MailDetails.styles';

type MailDetailsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'MailDetails'
>;

interface Props {
  navigation: MailDetailsScreenNavigationProp;
  mail: Mail;
}

const MailDetailsScreenBase: React.FC<Props> = (props: Props) => {
  const { mail } = props;
  const mailDate = format(
    mail.dateCreated ? new Date(mail.dateCreated) : new Date(),
    'MMM dd, yyyy'
  );

  return (
    <View
      style={[
        Styles.trueBackground,
        { backgroundColor: props.navigation ? undefined : '' },
      ]}
    >
      <View style={Styles.letterDate}>
        <Text style={[Typography.FONT_SEMIBOLD, Styles.baseText]}>
          {mailDate}
        </Text>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={[Typography.FONT_REGULAR, Styles.letterText]}>
          {mail.content}
        </Text>
        {mail.type === MailTypes.Letter && (
          <DisplayImage images={mail.images} />
        )}
        {mail.type === MailTypes.Postcard && (
          <DisplayImage
            images={[mail.design.image]}
            isPostcard
            paddingPostcard={5}
          />
        )}
      </ScrollView>
    </View>
  );
};

const blankMail: Mail = {
  id: -1,
  type: MailTypes.Letter,
  recipientId: -1,
  status: MailStatus.Created,
  dateCreated: new Date().toISOString(),
  expectedDelivery: new Date().toISOString(),
  content: '',
  images: [],
};

const mapStateToProps = (state: AppState) => ({
  mail: state.mail.active ? state.mail.active : blankMail,
});

const MailDetailsScreen = connect(mapStateToProps)(MailDetailsScreenBase);

export default MailDetailsScreen;

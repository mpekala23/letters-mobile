import React from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Mail, MailTypes, MailStatus } from 'types';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { format } from 'date-fns';
import { Typography } from '@styles';
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
    mail.dateCreated ? mail.dateCreated : new Date(),
    'MMM dd, yyyy'
  );
  let image = null;
  if (mail.type === MailTypes.Letter && mail.image) {
    image = (
      <Image
        style={Styles.memoryLanePicture}
        source={mail.image}
        testID="memoryLaneImage"
      />
    );
  } else if (mail.type === MailTypes.Postcard) {
    image = (
      <Image
        style={Styles.memoryLanePicture}
        source={mail.design.image}
        testID="memoryLaneImage"
      />
    );
  }
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
        {image}
      </ScrollView>
    </View>
  );
};

const blankMail: Mail = {
  id: -1,
  type: MailTypes.Letter,
  recipientId: -1,
  status: MailStatus.Created,
  dateCreated: new Date(),
  expectedDelivery: new Date(),
  content: '',
};

const mapStateToProps = (state: AppState) => ({
  mail: state.mail.active ? state.mail.active : blankMail,
});

const MailDetailsScreen = connect(mapStateToProps)(MailDetailsScreenBase);

export default MailDetailsScreen;

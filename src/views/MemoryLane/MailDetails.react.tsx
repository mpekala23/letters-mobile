import React, { Dispatch } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { AppStackParamList } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { Mail, MailTypes, MailStatus, Image } from 'types';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { format } from 'date-fns';
import { Typography } from '@styles';
import { DisplayImage } from '@components';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { setMailImages } from '@store/Mail/MailActions';
import Styles from './MailDetails.styles';

type MailDetailsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'MailDetails'
>;

interface Props {
  navigation: MailDetailsScreenNavigationProp;
  mail: Mail;
  updateMailImages: (
    images: Image[],
    contactId: number,
    mailId: number
  ) => void;
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
        <Text
          style={[
            Typography.FONT_REGULAR,
            Styles.letterText,
            {
              fontFamily:
                mail.type === MailTypes.Letter
                  ? undefined
                  : mail.customization.font.family,
              color:
                mail.type === MailTypes.Letter
                  ? undefined
                  : mail.customization.font.color,
            },
          ]}
        >
          {mail.content}
        </Text>
        {mail.type === MailTypes.Letter && (
          <DisplayImage
            images={mail.images}
            updateImages={(images) => {
              props.updateMailImages(images, mail.recipientId, mail.id);
            }}
          />
        )}
        {mail.type === MailTypes.Postcard && (
          <DisplayImage
            images={[mail.design.asset]}
            isPostcard
            paddingPostcard={5}
            updateImages={(images) => {
              props.updateMailImages(images, mail.recipientId, mail.id);
            }}
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

const mapDispatchToProps = (dispatch: Dispatch<MailActionTypes>) => ({
  updateMailImages: (images: Image[], contactId: number, mailId: number) =>
    dispatch(setMailImages(images, contactId, mailId)),
});

const MailDetailsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MailDetailsScreenBase);

export default MailDetailsScreen;

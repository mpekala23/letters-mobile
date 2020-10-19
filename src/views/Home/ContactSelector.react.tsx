import React, { Dispatch } from 'react';
import { Text, FlatList, View } from 'react-native';
import { Button, Icon, KeyboardAvoider } from '@components';
import { AppStackParamList, Screens } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography } from '@styles';
import { AppState } from '@store/types';
import { ContactActionTypes } from '@store/Contact/ContactTypes';
import { connect } from 'react-redux';
import { Mail, Contact, EntityTypes } from 'types';
import i18n from '@i18n';
import ContactSelectorCard from '@components/Card/ContactSelectorCard.react';
import { setActive } from '@store/Contact/ContactActions';
import { setActive as setActiveMail } from '@store/Mail/MailActions';
import { getCategories } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import * as Segment from 'expo-analytics-segment';
import { LinearGradient } from 'expo-linear-gradient';
import CardBackground from '@assets/views/Referrals/CardBackground';
import { Notif, NotifActionTypes, NotifTypes } from '@store/Notif/NotifTypes';
import { setUnrespondedNotifs } from '@store/Notif/NotifiActions';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { checkIfLoading } from '@store/selectors';
import Styles from './ContactSelector.styles';

type ContactSelectorScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.ContactSelector
>;

interface Props {
  existingContacts: Contact[];
  existingMail: Record<string, Mail[]>;
  navigation: ContactSelectorScreenNavigationProp;
  setActiveContact: (contact: Contact) => void;
  userPostal: string;
  userId: number;
  lastUpdatedCategories: string | null;
  unrespondedNotifs: Notif[];
  setUnrespondedNotifs: (notifs: Notif[]) => void;
  setActiveMail: (mail: Mail) => void;
  isLoadingMail: boolean;
}

class ContactSelectorScreenBase extends React.Component<Props> {
  private unsubscribeFocus: () => void;

  constructor(props: Props) {
    super(props);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
    this.renderReferralCard = this.renderReferralCard.bind(this);
    this.renderListHeader = this.renderListHeader.bind(this);
  }

  componentDidMount() {
    if (this.props.unrespondedNotifs && this.props.unrespondedNotifs.length) {
      const ix = this.props.unrespondedNotifs.findIndex(
        (notif) => notif.type === NotifTypes.HasReceived
      );
      if (ix < 0) return;
      const notif = this.props.unrespondedNotifs[ix];
      const contact =
        notif.data && notif.data.contactId
          ? this.props.existingContacts.find((testContact) => {
              return notif.data && testContact.id === notif.data.contactId;
            })
          : undefined;
      if (contact) {
        this.props.setActiveContact(contact);
      }
      const mail =
        contact && notif.data && notif.data.letterId
          ? this.props.existingMail[contact.id].find(
              (testMail) => notif.data && testMail.id === notif.data.letterId
            )
          : undefined;
      if (mail) {
        this.props.setActiveMail(mail);
      }
      Segment.track('Notifications - Delivery Check-In ');
      this.props.setUnrespondedNotifs([]);
      this.props.navigation.navigate(Screens.Issues);
    }
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
  }

  async onNavigationFocus() {
    if (this.props.existingContacts.length === 0) {
      this.props.navigation.replace(Screens.IntroContact);
    }
    getCategories().catch(() => {
      dropdownError({ message: i18n.t('Error.cantRefreshCategories') });
    });
  }

  renderItem = ({ item }: { item: Contact; index: number }): JSX.Element => {
    return (
      <ContactSelectorCard
        firstName={item.firstName}
        lastName={item.lastName}
        imageUri={item.image?.uri}
        numSent={item.totalSent}
        mail={this.props.existingMail[item.id]}
        onPress={() => {
          this.props.setActiveContact(item);
          this.props.navigation.navigate(Screens.SingleContact);
        }}
        userPostal={this.props.userPostal}
        contactPostal={item.facility.postal}
        key={`${item.inmateNumber}-${item.lastName}-${item.lastName}-${item.id}`}
        backgroundColor={item.backgroundColor}
        isLoadingMail={this.props.isLoadingMail}
      />
    );
  };

  renderAddContactButton = () => {
    return (
      <Button
        buttonText={i18n.t('ContactSelectorScreen.addContact')}
        onPress={() => {
          this.props.navigation.navigate(Screens.ContactInfo, {
            addFromSelector: true,
          });
          Segment.track('Contact Selector - Click on Add Contact');
        }}
        reverse
        containerStyle={Styles.addContactButton}
        textStyle={[Typography.FONT_BOLD]}
      />
    );
  };

  static renderInitialMessage(): JSX.Element {
    return (
      <Text
        style={[
          Typography.FONT_MEDIUM,
          {
            color: Colors.GRAY_400,
            fontSize: 16,
          },
        ]}
      >
        {i18n.t('ContactSelectorScreen.youDoNotHaveAnyContactsYet')}
      </Text>
    );
  }

  renderReferralCard(): JSX.Element {
    return (
      <View style={Styles.referralCardBackground}>
        <LinearGradient
          colors={['#032658', '#0748A6']}
          style={Styles.referralCardBgGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <Icon
          svg={CardBackground}
          style={Styles.referralCardBackgroundIllustration}
        />
        <View style={Styles.referralCardDesc}>
          <Text style={[Styles.referralCardTitle, Typography.FONT_BOLD]}>
            {i18n.t('ContactSelectorScreen.referralCardTitle')}
          </Text>
          <Text style={[Styles.referralCardSubtitle]}>
            {i18n.t('ContactSelectorScreen.referralCardSubtitle')}
          </Text>
          <Button
            buttonText={i18n.t('ContactSelectorScreen.referralCardCta')}
            onPress={async () => {
              this.props.navigation.navigate(Screens.ReferralDashboard);
              Segment.track('Contact Selector - Click on Referral Card');
            }}
            reverse
            containerStyle={Styles.referralCardCta}
            textStyle={[Typography.FONT_BOLD]}
          />
        </View>
      </View>
    );
  }

  renderListHeader() {
    return (
      <View style={{ paddingTop: 16 }}>
        {this.renderReferralCard()}
        <Text
          style={[
            Typography.FONT_SEMIBOLD,
            {
              color: Colors.GRAY_400,
              fontSize: 20,
              paddingTop: 8,
              paddingBottom: 4,
            },
          ]}
        >
          {i18n.t('ContactSelectorScreen.yourLovedOnes')}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <KeyboardAvoider style={Styles.trueBackground}>
        <FlatList
          key={`Flatlist${this.props.existingContacts.length}`}
          data={this.props.existingContacts}
          renderItem={this.renderItem}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          numColumns={this.props.existingContacts.length > 1 ? 2 : 1}
          ListHeaderComponent={this.renderListHeader}
          ListEmptyComponent={ContactSelectorScreenBase.renderInitialMessage}
          ListFooterComponent={this.renderAddContactButton}
          keyExtractor={(item) => item.inmateNumber.toString()}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoider>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  existingContacts: state.contact.existing,
  existingMail: state.mail.existing,
  userPostal: state.user.user.postal,
  userId: state.user.user.id,
  lastUpdatedCategories: state.category.lastUpdated,
  unrespondedNotifs: state.notif.unrespondedNotifs,
  isLoadingMail: checkIfLoading(state, EntityTypes.Mail),
});
const mapDispatchToProps = (
  dispatch: Dispatch<ContactActionTypes | NotifActionTypes | MailActionTypes>
) => {
  return {
    setActiveContact: (contact: Contact) => dispatch(setActive(contact)),
    setUnrespondedNotifs: (notifs: Notif[]) =>
      dispatch(setUnrespondedNotifs(notifs)),
    setActiveMail: (mail: Mail) => dispatch(setActiveMail(mail)),
  };
};
const ContactSelectorScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactSelectorScreenBase);

export default ContactSelectorScreen;

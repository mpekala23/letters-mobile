import React, { Dispatch } from 'react';
import { Text, FlatList } from 'react-native';
import { Button, KeyboardAvoider } from '@components';
import { AppStackParamList, Screens } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography } from '@styles';
import { AppState } from '@store/types';
import { ContactActionTypes } from '@store/Contact/ContactTypes';
import { connect } from 'react-redux';
import { Mail, Contact } from 'types';
import i18n from '@i18n';
import ContactSelectorCard from '@components/Card/ContactSelectorCard.react';
import { setActive } from '@store/Contact/ContactActions';
import { getContacts, getUser, uploadPushToken, getCategories } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { Notif, NotifActionTypes } from '@store/Notif/NotifTypes';
import { handleNotif } from '@store/Notif/NotifiActions';
import * as Segment from 'expo-analytics-segment';
import Notifs from '@notifications';
import { differenceInHours } from 'date-fns';
import Styles from './ContactSelector.styles';

type ContactSelectorScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ContactSelector'
>;

interface State {
  refreshing: boolean;
}

interface Props {
  existingContacts: Contact[];
  existingMail: Record<number, Mail[]>;
  navigation: ContactSelectorScreenNavigationProp;
  setActiveContact: (contact: Contact) => void;
  currentNotif: Notif | null;
  userPostal: string;
  handleNotif: () => void;
  userId: number;
  lastUpdatedCategories: string | null;
}

class ContactSelectorScreenBase extends React.Component<Props, State> {
  private unsubscribeFocus: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      refreshing: false,
    };
    this.doRefresh = this.doRefresh.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
  }

  async componentDidMount() {
    if (this.props.currentNotif) this.props.handleNotif();
    try {
      await Notifs.setup();
      this.props.handleNotif();
      const token = Notifs.getToken();
      await uploadPushToken(token);
    } catch (err) {
      dropdownError({ message: i18n.t('Permission.notifs') });
    }
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
  }

  async onNavigationFocus() {
    if (this.props.existingContacts.length <= 0) {
      this.props.navigation.replace(Screens.ContactInfo, {});
    }
    if (
      !this.props.lastUpdatedCategories ||
      differenceInHours(
        new Date(),
        new Date(this.props.lastUpdatedCategories)
      ) > 6
    ) {
      getCategories();
    }
  }

  async doRefresh() {
    if (this.props.userId === -1) return;
    this.setState({ refreshing: true });
    try {
      await getContacts();
      await getUser();
    } catch (e) {
      dropdownError({ message: i18n.t('Error.cantRefreshContacts') });
    }
    this.setState({ refreshing: false });
  }

  renderItem = ({ item }: { item: Contact }): JSX.Element => {
    return (
      <ContactSelectorCard
        firstName={item.firstName}
        lastName={item.lastName}
        imageUri={item.image?.uri}
        mail={this.props.existingMail[item.id]}
        onPress={() => {
          this.props.setActiveContact(item);
          this.props.navigation.navigate(Screens.SingleContact);
        }}
        userPostal={this.props.userPostal}
        contactPostal={item.facility?.postal}
        key={item.inmateNumber}
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
            color: Colors.GRAY_500,
            fontSize: 16,
          },
        ]}
      >
        {i18n.t('ContactSelectorScreen.youDoNotHaveAnyContactsYet')}
      </Text>
    );
  }

  render() {
    return (
      <KeyboardAvoider style={Styles.trueBackground}>
        <Text
          style={[
            Typography.FONT_SEMIBOLD,
            {
              color: Colors.GRAY_500,
              fontSize: 20,
              paddingBottom: 16,
            },
          ]}
        >
          {i18n.t('ContactSelectorScreen.yourLovedOnes')}
        </Text>
        <FlatList
          data={this.props.existingContacts}
          renderItem={this.renderItem}
          ListEmptyComponent={ContactSelectorScreenBase.renderInitialMessage}
          ListFooterComponent={this.renderAddContactButton}
          keyExtractor={(item) => item.inmateNumber.toString()}
          showsVerticalScrollIndicator={false}
          onRefresh={this.doRefresh}
          refreshing={this.state.refreshing}
        />
      </KeyboardAvoider>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  existingContacts: state.contact.existing,
  existingMail: state.mail.existing,
  currentNotif: state.notif.currentNotif,
  userPostal: state.user.user.postal,
  userId: state.user.user.id,
  lastUpdatedCategories: state.category.lastUpdated,
});
const mapDispatchToProps = (
  dispatch: Dispatch<ContactActionTypes | NotifActionTypes>
) => {
  return {
    setActiveContact: (contact: Contact) => dispatch(setActive(contact)),
    handleNotif: () => dispatch(handleNotif()),
  };
};
const ContactSelectorScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactSelectorScreenBase);

export default ContactSelectorScreen;

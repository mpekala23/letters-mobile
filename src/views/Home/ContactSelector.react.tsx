import React, { Dispatch } from 'react';
import {
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  FlatList,
} from 'react-native';
import { Icon } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography } from '@styles';
import { AppState } from '@store/types';
import { ContactActionTypes } from '@store/Contact/ContactTypes';
import { connect } from 'react-redux';
import { Mail, Contact } from 'types';
import i18n from '@i18n';
import AddContact from '@assets/views/ContactSelector/AddContact';
import ContactSelectorCard from '@components/Card/ContactSelectorCard.react';
import { setActive } from '@store/Contact/ContactActions';
import { getContacts, getUser, uploadPushToken } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { Notif, NotifActionTypes } from '@store/Notif/NotifTypes';
import { handleNotif } from '@store/Notif/NotifiActions';
import * as Segment from 'expo-analytics-segment';
import Notifs from '@notifications';
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
      console.log(token);
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
      this.props.navigation.replace('ContactInfo', {});
    }
    await this.doRefresh();
  }

  async doRefresh() {
    if (this.props.userId === -1) return;
    this.setState({ refreshing: true });
    try {
      await getContacts();
      await getUser();
    } catch (e) {
      console.log(e);
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
          this.props.navigation.navigate('SingleContact');
        }}
        userPostal={this.props.userPostal}
        contactPostal={item.facility?.postal}
        key={item.inmateNumber}
      />
    );
  };

  static renderInitialMessage(): JSX.Element {
    return (
      <Text
        style={[
          Typography.FONT_MEDIUM,
          {
            color: Colors.GRAY_DARK,
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
      <KeyboardAvoidingView
        style={Styles.trueBackground}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        <Text
          style={[
            Typography.FONT_BOLD,
            {
              color: Colors.GRAY_DARK,
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
          keyExtractor={(item) => item.inmateNumber.toString()}
          showsVerticalScrollIndicator={false}
          onRefresh={this.doRefresh}
          refreshing={this.state.refreshing}
        />
        <TouchableOpacity
          style={Styles.addContactButton}
          onPress={() => {
            this.props.navigation.navigate('ContactInfo', {
              addFromSelector: true,
            });
            Segment.track('Contact Selector - Click on Add Contact');
          }}
          testID="addContact"
        >
          <Icon svg={AddContact} style={{ marginTop: 13, marginRight: 2 }} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  existingContacts: state.contact.existing,
  existingMail: state.mail.existing,
  currentNotif: state.notif.currentNotif,
  userPostal: state.user.user.postal,
  userId: state.user.user.id,
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

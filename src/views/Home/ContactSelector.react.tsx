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
import { Contact, ContactActionTypes } from '@store/Contact/ContactTypes';
import { connect } from 'react-redux';
import { Letter } from 'types';
import i18n from '@i18n';
import AddContact from '@assets/views/ContactSelector/AddContact';
import ContactSelectorCard from '@components/Card/ContactSelectorCard.react';
import { setActive } from '@store/Contact/ContactActions';
import { getContacts, getUser } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { Notif, NotifActionTypes, NotifTypes } from '@store/Notif/NotifTypes';
import { handleNotif } from '@store/Notif/NotifiActions';
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
  existingLetters: Record<number, Letter[]>;
  navigation: ContactSelectorScreenNavigationProp;
  setActiveContact: (contact: Contact) => void;
  currentNotif: Notif | null;
  handleNotif: () => void;
}

class ContactSelectorScreenBase extends React.Component<Props, State> {
  private unsubscribeFocus: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      refreshing: false,
    };
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
  }

  componentDidMount() {
    if (this.props.currentNotif) this.props.handleNotif();
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
  }

  async onNavigationFocus() {
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
        imageUri={item.photo?.uri}
        letters={this.props.existingLetters[item.id]}
        onPress={() => {
          this.props.setActiveContact(item);
          this.props.navigation.navigate('SingleContact');
        }}
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
          onRefresh={async () => {
            this.setState({ refreshing: true });
            try {
              await getContacts();
              await getUser();
            } catch (err) {
              dropdownError({ message: i18n.t('Error.cantRefreshContacts') });
            }
            this.setState({ refreshing: false });
          }}
          refreshing={this.state.refreshing}
        />
        <TouchableOpacity
          style={Styles.addContactButton}
          onPress={() => {
            this.props.navigation.navigate('ContactInfo', {
              addFromSelector: true,
            });
          }}
          testID="addContact"
        >
          <Icon svg={AddContact} style={{ marginTop: 13, marginRight: 2 }} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    existingContacts: state.contact.existing,
    existingLetters: state.letter.existing,
    currentNotif: state.notif.currentNotif,
  };
};
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

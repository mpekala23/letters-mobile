import React, { createRef, Dispatch } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from 'react-native';
import { Button, Icon, Input } from '@components';
import { Colors, Typography } from '@styles';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  STATE_TO_ABBREV,
  STATE_TO_INMATE_DB,
  STATES_DROPDOWN,
  Validation,
} from '@utils';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setAdding } from '@store/Contact/ContactActions';
import {
  ContactState,
  Contact,
  ContactActionTypes,
} from '@store/Contact/ContactTypes';
import { UserState } from '@store/User/UserTypes';
import i18n from '@i18n';
import Letter from '@assets/views/AddContact/Letter';
import CommonStyles from './AddContact.styles';

type ContactInfoScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ContactInfo'
>;

export interface Props {
  navigation: ContactInfoScreenNavigationProp;
  userState: UserState;
  contactState: ContactState;
  route: {
    params: { addFromSelector?: boolean; phyState?: string };
  };
  setAdding: (contact: Contact) => void;
}

export interface State {
  inputting: boolean;
  valid: boolean;
  stateToSearch: string;
}

class ContactInfoScreenBase extends React.Component<Props, State> {
  private stateRef = createRef<Input>();

  private firstName = createRef<Input>();

  private lastName = createRef<Input>();

  private inmateNumber = createRef<Input>();

  private relationship = createRef<Input>();

  private unsubscribeFocus: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      inputting: false,
      valid: false,
      stateToSearch: '',
    };
    this.updateValid = this.updateValid.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
  }

  componentDidMount() {
    this.onNavigationFocus();
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
  }

  onNavigationFocus() {
    const addingContact = this.props.contactState.adding;

    if (this.props.route.params && this.props.route.params.addFromSelector) {
      if (this.stateRef.current)
        this.stateRef.current.setState({ dirty: false });
      if (this.firstName.current)
        this.firstName.current.setState({ dirty: false });
      if (this.lastName.current)
        this.lastName.current.setState({ dirty: false });
      if (this.inmateNumber.current)
        this.inmateNumber.current.setState({ dirty: false });
      if (this.relationship.current)
        this.relationship.current.setState({ dirty: false });
    }

    if (this.stateRef.current) {
      if (addingContact.facility)
        this.stateRef.current.set(addingContact.facility.state);
      else if (this.props.route.params && this.props.route.params.phyState) {
        this.stateRef.current.set(this.props.route.params.phyState);
      } else {
        this.stateRef.current.set('');
      }
      this.setState({ stateToSearch: this.stateRef.current.state.value });
    }
    if (this.firstName.current)
      this.firstName.current.set(addingContact.firstName);
    if (this.lastName.current)
      this.lastName.current.set(addingContact.lastName);
    if (this.inmateNumber.current)
      this.inmateNumber.current.set(addingContact.inmateNumber);
    if (this.relationship.current)
      this.relationship.current.set(addingContact.relationship);
  }

  updateValid() {
    if (
      this.stateRef.current &&
      this.firstName.current &&
      this.lastName.current &&
      this.inmateNumber.current &&
      this.relationship.current
    ) {
      const result =
        this.stateRef.current.state.valid &&
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.inmateNumber.current.state.valid &&
        this.relationship.current.state.valid;
      this.setState({ valid: result });
    }
  }

  render() {
    const inmateDatabaseLink =
      STATE_TO_INMATE_DB[STATE_TO_ABBREV[this.state.stateToSearch]]?.link;
    const tapHereToSearchStateDatabase =
      inmateDatabaseLink && inmateDatabaseLink !== '' ? (
        <Button
          link
          containerStyle={{ marginBottom: 20, alignSelf: 'flex-start' }}
          onPress={() => Linking.openURL(inmateDatabaseLink)}
        >
          <Text style={{ color: Colors.PINK_DARKER }}>
            {i18n.t('ContactInfoScreen.tapHereToSearch')}{' '}
            <Text style={[Typography.FONT_BOLD, { color: Colors.PINK_DARKER }]}>
              {this.state.stateToSearch}
            </Text>{' '}
            {i18n.t('ContactInfoScreen.database')}.
          </Text>
        </Button>
      ) : null;
    return (
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'white' }}
        onPress={() => Keyboard.dismiss()}
        activeOpacity={1.0}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : -200}
          enabled
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              scrollEnabled={this.state.inputting}
              style={{ width: '100%' }}
            >
              <View style={{ width: '100%' }} />
              <View style={CommonStyles.contactbackground}>
                <View style={{ flexDirection: 'row' }}>
                  <Typography.PageHeader
                    text={i18n.t('ContactInfoScreen.addContact')}
                  />
                  <Icon svg={Letter} style={{ margin: 16 }} />
                </View>
                <Text
                  style={{
                    color: Colors.PINK_DARKER,
                    marginTop: 10,
                    fontSize: 16,
                  }}
                >
                  {i18n.t('ContactInfoScreen.needHelpFindingYourInmateID')}
                </Text>
                <Button
                  link
                  containerStyle={{
                    marginTop: 12,
                    marginBottom: 12,
                    alignSelf: 'flex-start',
                  }}
                  onPress={() => {
                    Linking.openURL('https://www.bop.gov/inmateloc/');
                  }}
                >
                  <Text style={{ color: Colors.PINK_DARKER }}>
                    {i18n.t('ContactInfoScreen.tapHereToSearch')}{' '}
                    <Text
                      style={[
                        Typography.FONT_BOLD,
                        { color: Colors.PINK_DARKER },
                      ]}
                    >
                      {i18n.t('ContactInfoScreen.federal')}
                    </Text>{' '}
                    {i18n.t('ContactInfoScreen.database')}.
                  </Text>
                </Button>
                {tapHereToSearchStateDatabase}
                <Input
                  ref={this.stateRef}
                  parentStyle={(CommonStyles.fullWidth, { marginBottom: 10 })}
                  placeholder={i18n.t('ContactInfoScreen.state')}
                  options={STATES_DROPDOWN}
                  validate={Validation.State}
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={() => {
                    if (
                      this.stateRef.current &&
                      this.stateRef.current.state.valid
                    )
                      this.setState({
                        stateToSearch: this.stateRef.current?.state.value,
                      });
                    this.updateValid();
                  }}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.firstName}
                />
                <Input
                  ref={this.firstName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ContactInfoScreen.firstName')}
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.lastName}
                />
                <Input
                  ref={this.lastName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ContactInfoScreen.lastName')}
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.inmateNumber}
                />
                <Input
                  ref={this.inmateNumber}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ContactInfoScreen.inmateNumber')}
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.relationship}
                />
                <Input
                  ref={this.relationship}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ContactInfoScreen.relationshipToInmate')}
                  required
                  options={[
                    i18n.t('ContactInfoScreen.mother'),
                    i18n.t('ContactInfoScreen.father'),
                    i18n.t('ContactInfoScreen.brother'),
                    i18n.t('ContactInfoScreen.sister'),
                    i18n.t('ContactInfoScreen.sibling'),
                    i18n.t('ContactInfoScreen.daughter'),
                    i18n.t('ContactInfoScreen.son'),
                    i18n.t('ContactInfoScreen.grandmother'),
                    i18n.t('ContactInfoScreen.grandfather'),
                    i18n.t('ContactInfoScreen.grandaughter'),
                    i18n.t('ContactInfoScreen.grandson'),
                    i18n.t('ContactInfoScreen.friend'),
                    i18n.t('ContactInfoScreen.other'),
                  ]}
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
              </View>
            </ScrollView>
            <View style={CommonStyles.bottomButtonContainer}>
              <Button
                onPress={() => {
                  if (
                    this.stateRef.current &&
                    this.firstName.current &&
                    this.lastName.current &&
                    this.inmateNumber.current &&
                    this.relationship.current
                  ) {
                    const contact: Contact = {
                      id: -1,
                      firstName: this.firstName.current.state.value,
                      lastName: this.lastName.current.state.value,
                      inmateNumber: this.inmateNumber.current.state.value,
                      relationship: this.relationship.current.state.value,
                      facility: this.props.contactState.adding.facility,
                    };
                    this.props.setAdding(contact);
                    this.props.navigation.navigate('FacilityDirectory', {
                      phyState: this.stateRef.current.state.value,
                    });
                  }
                }}
                buttonText={i18n.t('ContactInfoScreen.next')}
                enabled={this.state.valid}
                containerStyle={CommonStyles.bottomButton}
                showNextIcon
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  userState: state.user,
  contactState: state.contact,
});
const mapDispatchToProps = (dispatch: Dispatch<ContactActionTypes>) => {
  return {
    setAdding: (contact: Contact) => dispatch(setAdding(contact)),
  };
};
const ContactInfoScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactInfoScreenBase);

export default ContactInfoScreen;

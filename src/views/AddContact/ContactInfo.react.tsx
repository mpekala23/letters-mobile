import React, { createRef, Dispatch } from 'react';
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from 'react-native';
import { Button, Icon, Input, KeyboardAvoider } from '@components';
import { Colors, Typography } from '@styles';
import { AppStackParamList, Screens } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  STATE_TO_ABBREV,
  STATE_TO_INMATE_DB,
  STATES_DROPDOWN,
  Validation,
} from '@utils';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setAddingPersonal } from '@store/Contact/ContactActions';
import { ContactActionTypes } from '@store/Contact/ContactTypes';
import i18n from '@i18n';
import Letter from '@assets/views/AddContact/Letter';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import * as Segment from 'expo-analytics-segment';
import { ContactPersonal, ContactDraft } from 'types';
import CommonStyles from './AddContact.styles';

type ContactInfoScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ContactInfo'
>;

export interface Props {
  navigation: ContactInfoScreenNavigationProp;
  contactDraft: ContactDraft;
  route: {
    params: { addFromSelector?: boolean; phyState?: string };
  };
  setAddingPersonal: (contactPersonal: ContactPersonal) => void;
}

export interface State {
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

  private unsubscribeBlur: () => void;

  private scrollView = createRef<ScrollView>();

  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
      stateToSearch: '',
    };
    this.updateValid = this.updateValid.bind(this);
    this.onNextPress = this.onNextPress.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
    this.onNavigationBlur = this.onNavigationBlur.bind(this);
    this.unsubscribeBlur = this.props.navigation.addListener(
      'blur',
      this.onNavigationBlur
    );
  }

  componentDidMount() {
    this.loadValuesFromStore();
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
  }

  onNavigationFocus() {
    this.loadValuesFromStore();
    setProfileOverride({
      enabled: this.state.valid,
      text: i18n.t('ContactInfoScreen.next'),
      action: this.onNextPress,
    });
  }

  onNavigationBlur = () => {
    setProfileOverride(undefined);
  };

  onNextPress() {
    Segment.trackWithProperties('Add Contact - Click on Next', {
      page: 'info',
    });
    if (
      this.stateRef.current &&
      this.firstName.current &&
      this.lastName.current &&
      this.inmateNumber.current &&
      this.relationship.current
    ) {
      const contactPersonal: ContactPersonal = {
        firstName: this.firstName.current.state.value,
        lastName: this.lastName.current.state.value,
        inmateNumber: this.inmateNumber.current.state.value,
        relationship: this.relationship.current.state.value,
      };
      this.props.setAddingPersonal(contactPersonal);
      this.props.navigation.setParams({
        phyState: this.stateRef.current.state.value,
      });
      this.props.navigation.navigate(Screens.FacilityDirectory, {
        phyState: this.stateRef.current.state.value,
      });
    }
  }

  setValid(val: boolean) {
    this.setState({ valid: val });
    setProfileOverride({
      enabled: val,
      text: i18n.t('ContactInfoScreen.next'),
      action: this.onNextPress,
    });
  }

  loadValuesFromStore() {
    const addingContact = this.props.contactDraft;
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
      if (this.props.route.params && this.props.route.params.phyState) {
        this.stateRef.current.set(this.props.route.params.phyState);
      } else if (addingContact.facility) {
        this.stateRef.current.set(addingContact.facility.state);
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
      this.setValid(result);
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
          onPress={() => {
            Segment.trackWithProperties('Add Contact - Click on State Search', {
              State: this.state.stateToSearch,
            });
            Linking.openURL(inmateDatabaseLink);
          }}
        >
          <Text style={{ color: Colors.PINK_500 }}>
            {i18n.t('ContactInfoScreen.tapHereToSearch')}{' '}
            <Text
              style={[Typography.FONT_SEMIBOLD, { color: Colors.PINK_500 }]}
            >
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
        <KeyboardAvoider
          style={{ flexDirection: 'column', justifyContent: 'center' }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ScrollView
              ref={this.scrollView}
              keyboardShouldPersistTaps="handled"
              style={{ width: '100%' }}
            >
              <View style={CommonStyles.contactbackground}>
                <View style={{ flexDirection: 'row' }}>
                  <Typography.PageHeader
                    text={i18n.t('ContactInfoScreen.addContact')}
                  />
                  <Icon svg={Letter} style={{ margin: 16 }} />
                </View>
                <Text
                  style={[
                    Typography.FONT_MEDIUM,
                    {
                      color: Colors.GRAY_500,
                      marginTop: 8,
                      fontSize: 15,
                    },
                  ]}
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
                    Segment.track('Add Contact - Click on Federal Search');
                    Linking.openURL(
                      'https://www.bop.gov/mobile/find_inmate/byname.jsp'
                    );
                  }}
                >
                  <Text style={{ color: Colors.PINK_500 }}>
                    {i18n.t('ContactInfoScreen.tapHereToSearch')}{' '}
                    <Text
                      style={[
                        Typography.FONT_SEMIBOLD,
                        { color: Colors.PINK_500 },
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
                  onValid={this.updateValid}
                  onInvalid={() => this.setValid(false)}
                  nextInput={this.lastName}
                />
                <Input
                  ref={this.lastName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ContactInfoScreen.lastName')}
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setValid(false)}
                  nextInput={this.inmateNumber}
                />
                <Input
                  ref={this.inmateNumber}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ContactInfoScreen.inmateNumber')}
                  required
                  validate={Validation.InmateNumber}
                  onValid={this.updateValid}
                  onInvalid={() => this.setValid(false)}
                  nextInput={this.relationship}
                />
                <Input
                  ref={this.relationship}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ContactInfoScreen.relationshipToInmate')}
                  required
                  options={[
                    i18n.t('ContactInfoScreen.spouse'),
                    i18n.t('ContactInfoScreen.parent'),
                    i18n.t('ContactInfoScreen.kid'),
                    i18n.t('ContactInfoScreen.sibling'),
                    i18n.t('ContactInfoScreen.grandparent'),
                    i18n.t('ContactInfoScreen.family'),
                    i18n.t('ContactInfoScreen.friend'),
                    i18n.t('ContactInfoScreen.mentor'),
                    i18n.t('ContactInfoScreen.other'),
                  ]}
                  onValid={this.updateValid}
                  onInvalid={() => this.setValid(false)}
                  strictDropdown
                  onDropdownOpen={() => {
                    if (this.scrollView.current)
                      this.scrollView.current.scrollToEnd({ animated: true });
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoider>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  contactDraft: state.contact.adding,
});
const mapDispatchToProps = (dispatch: Dispatch<ContactActionTypes>) => {
  return {
    setAddingPersonal: (contactPersonal: ContactPersonal) =>
      dispatch(setAddingPersonal(contactPersonal)),
  };
};
const ContactInfoScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactInfoScreenBase);

export default ContactInfoScreen;

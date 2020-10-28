import React, { createRef, Dispatch } from 'react';
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, Input, KeyboardAvoider, Picker, PickerRef } from '@components';
import { Typography } from '@styles';
import { AppStackParamList, Screens } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { LOB_NAME_CHAR_LIMIT, STATE_TO_ABBREV, STATES_DROPDOWN } from '@utils';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setAddingPersonal } from '@store/Contact/ContactActions';
import { ContactActionTypes } from '@store/Contact/ContactTypes';
import i18n from '@i18n';
import Letter from '@assets/views/AddContact/Letter';
import * as Segment from 'expo-analytics-segment';
import { ContactPersonal, ContactDraft, TopbarRight } from 'types';
import { getFacilities } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { setTopbarRight } from '@store/UI/UIActions';
import { UIActionTypes } from '@store/UI/UITypes';
import CommonStyles from './AddContact.styles';

type ContactInfoScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.ContactInfo
>;

export interface Props {
  navigation: ContactInfoScreenNavigationProp;
  contactDraft: ContactDraft;
  route: {
    params?: { addFromSelector?: boolean; phyState?: string };
  };
  setAddingPersonal: (contactPersonal: ContactPersonal) => void;
  setTopbarRight: (details: TopbarRight | null) => void;
}

export interface State {
  valid: boolean;
}

class ContactInfoScreenBase extends React.Component<Props, State> {
  private statePicker = createRef<PickerRef>();

  private firstName = createRef<Input>();

  private lastName = createRef<Input>();

  private inmateNumber = createRef<Input>();

  private relationshipPicker = createRef<PickerRef>();

  private unsubscribeFocus: () => void;

  private scrollView = createRef<ScrollView>();

  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
    };
    this.updateValid = this.updateValid.bind(this);
    this.onNextPress = this.onNextPress.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
    this.isExceedsNameCharLimit = this.isExceedsNameCharLimit.bind(this);
  }

  componentDidMount() {
    this.loadValuesFromStore();
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
  }

  onNavigationFocus() {
    this.loadValuesFromStore();
    this.props.setTopbarRight({
      enabled: this.state.valid,
      text: i18n.t('ContactInfoScreen.next'),
      action: this.onNextPress,
    });
  }

  onNextPress() {
    Segment.trackWithProperties('Add Contact - Click on Next', {
      page: 'info',
    });
    if (
      this.statePicker.current &&
      this.firstName.current &&
      this.lastName.current &&
      this.relationshipPicker.current
    ) {
      const contactPersonal: ContactPersonal = {
        firstName: this.firstName.current.state.value,
        lastName: this.lastName.current.state.value,
        relationship: this.relationshipPicker.current.value,
      };
      this.props.setAddingPersonal(contactPersonal);
      this.props.navigation.setParams({
        phyState: this.statePicker.current.value,
      });
      this.props.navigation.navigate(Screens.FacilityDirectory, {
        phyState: this.statePicker.current.value,
      });
    }
  }

  setValid(val: boolean) {
    this.setState({ valid: val });
    this.props.setTopbarRight({
      enabled: val,
      text: i18n.t('ContactInfoScreen.next'),
      action: this.onNextPress,
    });
  }

  loadValuesFromStore() {
    const addingContact = this.props.contactDraft;
    const addingFromSelector =
      this.props.route.params && this.props.route.params.addFromSelector;

    if (addingFromSelector) {
      if (this.firstName.current)
        this.firstName.current.setState({ dirty: false });
      if (this.lastName.current)
        this.lastName.current.setState({ dirty: false });
    }

    this.props.navigation.setParams({ addFromSelector: false });

    if (this.statePicker.current) {
      this.statePicker.current.setStoredValue(
        this.props.route.params && this.props.route.params.phyState
          ? this.props.route.params.phyState
          : addingContact.facility.state,
        !addingFromSelector
      );
    }
    if (this.firstName.current)
      this.firstName.current.set(addingContact.firstName);
    if (this.lastName.current)
      this.lastName.current.set(addingContact.lastName);
    if (this.relationshipPicker.current) {
      this.relationshipPicker.current.setStoredValue(
        addingContact.relationship,
        !addingFromSelector
      );
    }
  }

  updateValid() {
    if (
      this.statePicker.current &&
      this.firstName.current &&
      this.lastName.current &&
      this.relationshipPicker.current
    ) {
      const result =
        this.statePicker.current.isValueSelected() &&
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.relationshipPicker.current.isValueSelected();
      this.setValid(result);
    }
  }

  isExceedsNameCharLimit() {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.inmateNumber.current
    ) {
      return (
        this.firstName.current.state.value.length +
          this.lastName.current.state.value.length >
        LOB_NAME_CHAR_LIMIT
      );
    }
    return false;
  }

  render() {
    return (
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'white' }}
        onPress={() => Keyboard.dismiss()}
        activeOpacity={1.0}
      >
        <KeyboardAvoider
          style={{ flexDirection: 'column', justifyContent: 'center' }}
        >
          <TouchableOpacity
            activeOpacity={1.0}
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
              <TouchableOpacity
                activeOpacity={1.0}
                style={CommonStyles.contactbackground}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Typography.PageHeader
                    text={i18n.t('ContactInfoScreen.addContact')}
                  />
                  <Icon svg={Letter} style={{ margin: 16 }} />
                </View>
                <Picker
                  ref={this.statePicker}
                  items={STATES_DROPDOWN}
                  placeholder={i18n.t('ContactInfoScreen.state')}
                  onValueChange={(v) => {
                    this.updateValid();
                    const abbrev = STATE_TO_ABBREV[v];
                    if (abbrev)
                      getFacilities(abbrev).catch(() => {
                        dropdownError({
                          message: i18n.t('Error.cantRefreshFacilities'),
                        });
                      });
                  }}
                />
                <Input
                  ref={this.firstName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ContactInfoScreen.firstName')}
                  required
                  onChangeText={() => {
                    if (this.lastName.current) {
                      this.lastName.current.doValidate();
                    }
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setValid(false)}
                  nextInput={this.lastName}
                  isInvalidInput={this.isExceedsNameCharLimit}
                />
                <Input
                  ref={this.lastName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ContactInfoScreen.lastName')}
                  required
                  onChangeText={() => {
                    if (this.firstName.current) {
                      this.firstName.current.doValidate();
                    }
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setValid(false)}
                  isInvalidInput={this.isExceedsNameCharLimit}
                />
                {this.isExceedsNameCharLimit() && (
                  <Text style={{ textAlign: 'center', marginBottom: 5 }}>
                    {i18n.t('ContactInfoScreen.nameTooLong')}
                  </Text>
                )}
                <Picker
                  ref={this.relationshipPicker}
                  items={[
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
                  placeholder={i18n.t('ContactInfoScreen.relationshipToInmate')}
                  onValueChange={() => {
                    this.updateValid();
                  }}
                />
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </KeyboardAvoider>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  contactDraft: state.contact.adding,
});
const mapDispatchToProps = (
  dispatch: Dispatch<ContactActionTypes | UIActionTypes>
) => ({
  setAddingPersonal: (contactPersonal: ContactPersonal) =>
    dispatch(setAddingPersonal(contactPersonal)),
  setTopbarRight: (details: TopbarRight | null) =>
    dispatch(setTopbarRight(details)),
});
const ContactInfoScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactInfoScreenBase);

export default ContactInfoScreen;

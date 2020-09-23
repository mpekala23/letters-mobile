import React, { createRef, Dispatch } from 'react';
import { View, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { Typography } from '@styles';
import { AppStackParamList, Screens } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { Input, Icon, KeyboardAvoider, Picker, PickerRef } from '@components';
import { Validation, STATES_DROPDOWN } from '@utils';
import { Facility, PrisonTypes, ContactFacility } from 'types';
import i18n from '@i18n';
import FacilityIcon from '@assets/views/AddContact/Facility';
import { connect } from 'react-redux';
import { setAddingFacility } from '@store/Contact/ContactActions';
import { ContactState, ContactActionTypes } from '@store/Contact/ContactTypes';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import * as Segment from 'expo-analytics-segment';
import { AppState } from '@store/types';
import CommonStyles from './AddContact.styles';

type AddManuallyScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'AddManually'
>;

export interface Props {
  navigation: AddManuallyScreenNavigationProp;
  route: {
    params: {
      phyState: string;
    };
  };
  contactState: ContactState;
  setAddingFacility: (contactFacility: ContactFacility) => void;
}

export interface State {
  inputting: boolean;
  valid: boolean;
}

class AddManuallyScreenBase extends React.Component<Props, State> {
  private facilityName = createRef<Input>();

  private facilityAddress = createRef<Input>();

  private facilityCity = createRef<Input>();

  private facilityStatePicker = createRef<PickerRef>();

  private facilityPostal = createRef<Input>();

  private facilityPhone = createRef<Input>();

  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      inputting: false,
      valid: false,
    };
    this.updateValid = this.updateValid.bind(this);
    this.onAddFacility = this.onAddFacility.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = this.props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
    this.onNavigationBlur = this.onNavigationBlur.bind(this);
    this.unsubscribeBlur = this.props.navigation.addListener(
      'blur',
      this.onNavigationBlur
    );
  }

  componentWillUnmount(): void {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
  }

  onNavigationBlur = (): void => {
    setProfileOverride(undefined);
  };

  onNavigationFocus(): void {
    this.loadValuesFromStore();
    setProfileOverride({
      enabled: this.state.valid,
      text: i18n.t('ContactInfoScreen.next'),
      action: this.onAddFacility,
    });
  }

  onAddFacility(): void {
    Segment.trackWithProperties('Add Contact - Click on Next', {
      page: 'manual',
    });
    if (
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.facilityCity.current &&
      this.facilityPostal.current &&
      this.facilityStatePicker.current &&
      this.facilityPhone.current
    ) {
      const facility: Facility = {
        name: this.facilityName.current.state.value,
        type: PrisonTypes.Federal,
        address: this.facilityAddress.current.state.value,
        city: this.facilityCity.current.state.value,
        state: this.facilityStatePicker.current.value,
        postal: this.facilityPostal.current.state.value,
        phone: this.facilityPhone.current.state.value,
      };
      const contactFacility = { facility };
      this.props.setAddingFacility(contactFacility);
      this.props.navigation.navigate(Screens.ReviewContact, { manual: true });
    }
    Keyboard.dismiss();
  }

  setValid(val: boolean): void {
    this.setState({ valid: val });
    setProfileOverride({
      enabled: val,
      text: i18n.t('ContactInfoScreen.next'),
      action: this.onAddFacility,
    });
  }

  updateValid(): void {
    if (
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.facilityCity.current &&
      this.facilityStatePicker.current &&
      this.facilityPostal.current &&
      this.facilityPhone.current
    ) {
      const result =
        this.facilityName.current.state.valid &&
        this.facilityAddress.current.state.valid &&
        this.facilityCity.current.state.valid &&
        this.facilityStatePicker.current.isValueSelected() &&
        this.facilityPostal.current.state.valid &&
        this.facilityPhone.current.state.valid;
      this.setValid(result);
    }
  }

  loadValuesFromStore(): void {
    const addingFacility = this.props.contactState.adding.facility;
    if (addingFacility) {
      if (this.facilityName.current)
        this.facilityName.current.set(addingFacility.name);
      if (this.facilityAddress.current)
        this.facilityAddress.current.set(addingFacility.address);
      if (this.facilityCity.current)
        this.facilityCity.current.set(addingFacility.city);
      if (this.facilityPostal.current)
        this.facilityPostal.current.set(addingFacility.postal);
      if (this.facilityPhone.current)
        this.facilityPhone.current.set(addingFacility.phone);
    }
    if (this.facilityStatePicker.current) {
      this.facilityStatePicker.current.setStoredValue(
        this.props.route.params.phyState
      );
    }
  }

  render(): JSX.Element {
    return (
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'white' }}
        onPress={Keyboard.dismiss}
        activeOpacity={1.0}
      >
        <KeyboardAvoider>
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
              <View style={CommonStyles.contactbackground}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                  <Typography.PageHeader
                    text={i18n.t('AddManuallyScreen.facilityAddress')}
                  />
                  <Icon svg={FacilityIcon} style={{ margin: 16 }} />
                </View>
                <Input
                  ref={this.facilityName}
                  parentStyle={{
                    width: '100%',
                    marginTop: 10,
                  }}
                  placeholder={i18n.t('AddManuallyScreen.facilityName')}
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setValid(false)}
                  nextInput={this.facilityAddress}
                />
                <Input
                  ref={this.facilityAddress}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('AddManuallyScreen.facilityAddress')}
                  required
                  validate={Validation.Address}
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setValid(false)}
                  nextInput={this.facilityCity}
                />
                <Input
                  ref={this.facilityCity}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('AddManuallyScreen.facilityCity')}
                  required
                  validate={Validation.City}
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setValid(false)}
                />
                <Picker
                  ref={this.facilityStatePicker}
                  items={STATES_DROPDOWN}
                  placeholder={i18n.t('AddManuallyScreen.facilityState')}
                  onValueChange={() => {
                    this.updateValid();
                  }}
                />
                <Input
                  ref={this.facilityPostal}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('AddManuallyScreen.facilityPostal')}
                  required
                  validate={Validation.Postal}
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setValid(false)}
                  nextInput={this.facilityPhone}
                />
                <Input
                  ref={this.facilityPhone}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('AddManuallyScreen.facilityPhone')}
                  validate={Validation.Phone}
                  onValid={this.updateValid}
                  onInvalid={() => this.setValid(false)}
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
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
  contactState: state.contact,
});
const mapDispatchToProps = (dispatch: Dispatch<ContactActionTypes>) => {
  return {
    setAddingFacility: (contactFacility: ContactFacility) =>
      dispatch(setAddingFacility(contactFacility)),
  };
};

const AddManuallyScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddManuallyScreenBase);

export default AddManuallyScreen;

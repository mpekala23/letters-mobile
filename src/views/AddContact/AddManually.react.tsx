import React, { createRef } from 'react';
import {
  KeyboardAvoidingView,
  View,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import { Typography } from '@styles';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input, Icon } from '@components';
import { Validation, STATES_DROPDOWN } from '@utils';
import { Facility, PrisonTypes } from 'types';
import i18n from '@i18n';
import FacilityIcon from '@assets/views/AddContact/Facility';
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
}

export interface State {
  inputting: boolean;
  valid: boolean;
}

class AddManuallyScreen extends React.Component<Props, State> {
  private facilityName = createRef<Input>();

  private facilityAddress = createRef<Input>();

  private facilityCity = createRef<Input>();

  private facilityState = createRef<Input>();

  private facilityPostal = createRef<Input>();

  private unsubscribeFocus: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      inputting: false,
      valid: false,
    };
    this.updateValid = this.updateValid.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = this.props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
  }

  componentWillUnmount(): void {
    this.unsubscribeFocus();
  }

  onNavigationFocus(): void {
    if (this.facilityState.current)
      this.facilityState.current.set(this.props.route.params.phyState);
  }

  updateValid(): void {
    if (
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.facilityCity.current &&
      this.facilityState.current &&
      this.facilityPostal.current
    ) {
      const result =
        this.facilityName.current.state.valid &&
        this.facilityAddress.current.state.valid &&
        this.facilityCity.current.state.valid &&
        this.facilityState.current.state.valid &&
        this.facilityPostal.current.state.valid;
      this.setState({ valid: result });
    }
  }

  render(): JSX.Element {
    return (
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'white' }}
        onPress={Keyboard.dismiss}
        activeOpacity={1.0}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
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
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.facilityAddress}
                />
                <Input
                  ref={this.facilityAddress}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('AddManuallyScreen.facilityAddress')}
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.facilityCity}
                />
                <Input
                  ref={this.facilityCity}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('AddManuallyScreen.facilityCity')}
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.facilityState}
                />
                <Input
                  ref={this.facilityState}
                  parentStyle={[CommonStyles.fullWidth, { marginBottom: 10 }]}
                  placeholder={i18n.t('AddManuallyScreen.facilityState')}
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  validate={Validation.State}
                  options={STATES_DROPDOWN}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.facilityPostal}
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
                  onInvalid={() => this.setState({ valid: false })}
                />
              </View>
            </ScrollView>
          </View>
          <View style={CommonStyles.bottomButtonContainer}>
            <Button
              onPress={() => {
                if (
                  this.facilityName.current &&
                  this.facilityAddress.current &&
                  this.facilityCity.current &&
                  this.facilityPostal.current &&
                  this.facilityState.current
                ) {
                  const facility: Facility = {
                    name: this.facilityName.current.state.value,
                    type: PrisonTypes.Federal,
                    address: this.facilityAddress.current.state.value,
                    city: this.facilityCity.current.state.value,
                    state: this.facilityState.current.state.value,
                    postal: this.facilityPostal.current.state.value,
                  };
                  this.props.navigation.navigate('FacilityDirectory', {
                    newFacility: facility,
                    phyState: this.facilityState.current.state.value,
                  });
                } else {
                  this.props.navigation.navigate('FacilityDirectory');
                }
              }}
              buttonText={i18n.t('ContactInfoScreen.next')}
              enabled={this.state.valid}
              containerStyle={CommonStyles.bottomButton}
              showNextIcon
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

export default AddManuallyScreen;

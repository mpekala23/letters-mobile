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
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input } from '@components';
import { Validation } from 'utils';
import { Facility } from 'types';
import i18n from '@i18n';
import CommonStyles from './AddContact.styles';

type AddManuallyScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'AddManually'
>;

export interface Props {
  navigation: AddManuallyScreenNavigationProp;
}

export interface State {
  inputting: boolean;
  valid: boolean;
}

class AddManuallyScreen extends React.Component<Props, State> {
  private facilityName = createRef<Input>();

  private facilityAddress = createRef<Input>();

  private facilityCity = createRef<Input>();

  private facilityPostal = createRef<Input>();

  constructor(props: Props) {
    super(props);
    this.state = {
      inputting: false,
      valid: false,
    };
    this.updateValid = this.updateValid.bind(this);
  }

  updateValid(): void {
    if (
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.facilityCity.current &&
      this.facilityPostal.current
    ) {
      const result =
        this.facilityName.current.state.valid &&
        this.facilityAddress.current.state.valid &&
        this.facilityCity.current.state.valid &&
        this.facilityPostal.current.state.valid;
      this.setState({ valid: result });
    }
  }

  render(): JSX.Element {
    return (
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'white' }}
        onPress={() => Keyboard.dismiss()}
        activeOpacity={1.0}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              <View style={{ width: '100%', height: 40 }} />
              <View style={CommonStyles.contactbackground}>
                <Typography.PageHeader
                  text={i18n.t('AddManuallyScreen.addAFacility')}
                />
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
        </KeyboardAvoidingView>
        <View style={CommonStyles.bottomButtonContainer}>
          <Button
            onPress={() => {
              this.props.navigation.navigate('FacilityDirectory');
            }}
            buttonText={i18n.t('ContactInfoScreen.back')}
            reverse
            containerStyle={CommonStyles.bottomButton}
          />
          <Button
            onPress={() => {
              if (
                this.facilityName.current &&
                this.facilityAddress.current &&
                this.facilityCity.current &&
                this.facilityPostal.current
              ) {
                const facility: Facility = {
                  name: this.facilityName.current.state.value,
                  type: 'State Prison',
                  address: this.facilityAddress.current.state.value,
                  city: this.facilityCity.current.state.value,
                  state: 'MN',
                  postal: this.facilityPostal.current.state.value,
                };
                this.props.navigation.navigate('FacilityDirectory', {
                  newFacility: facility,
                });
              } else {
                this.props.navigation.navigate('FacilityDirectory');
              }
            }}
            buttonText={i18n.t('ContactInfoScreen.next')}
            enabled={this.state.valid}
            containerStyle={CommonStyles.bottomButton}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default AddManuallyScreen;

import React, { createRef, Dispatch } from 'react';
import {
  KeyboardAvoidingView,
  View,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import { Colors, Typography } from '@styles';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input, PicUpload } from '@components';
import { STATES_DROPDOWN, Validation } from '@utils';
import { AppState } from 'store/types';
import {
  Contact,
  ContactActionTypes,
  ContactState,
} from 'store/Contact/ContactTypes';
import { setAdding } from 'store/Contact/ContactActions';
import { connect } from 'react-redux';
import CommonStyles from './AddContact.styles';
import Styles from './ReviewContact.styles';

type ReviewContactScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReviewContact'
>;

export interface Props {
  navigation: ReviewContactScreenNavigationProp;
  contactState: ContactState;
  setAdding: (contact: Contact) => void;
}

export interface State {
  valid: boolean;
}

class ReviewContactScreenBase extends React.Component<Props, State> {
  private stateRef = createRef<Input>();

  private firstName = createRef<Input>();

  private lastName = createRef<Input>();

  private postal = createRef<Input>();

  private facilityName = createRef<Input>();

  private facilityAddress = createRef<Input>();

  private unit = createRef<Input>();

  private dorm = createRef<Input>();

  private unsubscribeFocus: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
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
    if (
      this.stateRef.current &&
      this.firstName.current &&
      this.lastName.current &&
      this.postal.current &&
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.props.contactState.adding.facility
    ) {
      this.stateRef.current.set(this.props.contactState.adding.state);
      this.firstName.current.set(this.props.contactState.adding.firstName);
      this.lastName.current.set(this.props.contactState.adding.lastName);
      this.postal.current.set(this.props.contactState.adding.facility.postal);
      this.facilityName.current.set(
        this.props.contactState.adding.facility.name
      );
      this.facilityAddress.current.set(
        this.props.contactState.adding.facility.address
      );
    }
  }

  updateValid() {
    if (
      this.stateRef.current &&
      this.firstName.current &&
      this.lastName.current &&
      this.postal.current &&
      this.facilityName.current &&
      this.facilityAddress.current
    ) {
      const result =
        this.stateRef.current.state.valid &&
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.postal.current.state.valid &&
        this.facilityName.current.state.valid &&
        this.facilityAddress.current.state.valid;
      this.setState({ valid: result });
    }
  }

  render() {
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
              style={{ width: '100%' }}
            >
              <View style={{ width: '100%', height: 40 }} />
              <View style={CommonStyles.contactbackground}>
                <Typography.PageHeader text="Review Contact" />
                <View style={{ alignSelf: 'center', marginVertical: 10 }}>
                  <View style={{ alignSelf: 'center' }}>
                    <PicUpload />
                  </View>
                  <Text style={Typography.FONT_ITALIC}>
                    Click to upload contact`&apos;`s image.
                  </Text>
                </View>
                <Input
                  ref={this.stateRef}
                  parentStyle={{
                    width: '100%',
                    marginTop: 10,
                  }}
                  placeholder="State"
                  options={STATES_DROPDOWN}
                  validate={Validation.State}
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.firstName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="First Name"
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.lastName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Last Name"
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.postal}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Postal"
                  required
                  validate={Validation.Postal}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.facilityName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Facility Name"
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.facilityAddress}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Facility Address"
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.unit}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Unit (optional, only if needed)"
                />
                <Input
                  ref={this.dorm}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Dorm (optional, only if needed)"
                />
                <View style={{ width: '100%', height: 80 }} />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        <View style={CommonStyles.bottomButtonContainer}>
          <Button
            onPress={() => {
              this.props.navigation.navigate('FacilityDirectory');
            }}
            buttonText="Back"
            reverse
            containerStyle={CommonStyles.bottomButton}
          />
          <Button
            onPress={() => {
              this.props.navigation.navigate('ReviewContact');
            }}
            buttonText="Add Contact"
            enabled={this.state.valid}
            containerStyle={CommonStyles.bottomButton}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  contactState: state.contact,
});
const mapDispatchToProps = (dispatch: Dispatch<ContactActionTypes>) => {
  return {
    setAdding: (contact: Contact) => dispatch(setAdding(contact)),
  };
};
const ReviewContactScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewContactScreenBase);

export default ReviewContactScreen;

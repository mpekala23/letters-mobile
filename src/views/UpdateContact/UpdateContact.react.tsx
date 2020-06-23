import React, { createRef } from 'react';
import {
  Text,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Platform,
  View,
} from 'react-native';
import { Button, Input, ProfilePic } from '@components';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { Contact } from 'store/Contact/ContactTypes';
import { ProfilePicTypes } from 'types';
import { Typography } from '@styles';
import Styles from './UpdateContact.styles';

type UpdateContactScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'UpdateContact'
>;

export interface Props {
  navigation: UpdateContactScreenNavigationProp;
  contact: Contact;
}

export interface State {
  valid: boolean;
}

class UpdateContactScreenBase extends React.Component<Props, State> {
  private firstName = createRef<Input>();

  private lastName = createRef<Input>();

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
      this.firstName.current &&
      this.lastName.current &&
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.props.contact.facility
    ) {
      this.firstName.current.set(this.props.contact.firstName);
      this.lastName.current.set(this.props.contact.lastName);
      this.facilityName.current.set(this.props.contact.facility.name);
      this.facilityAddress.current.set(this.props.contact.facility.address);
    }
  }

  updateValid() {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.facilityName.current &&
      this.facilityAddress.current
    ) {
      const result =
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.facilityName.current.state.valid &&
        this.facilityAddress.current.state.valid;
      this.setState({ valid: result });
    }
  }

  render() {
    const { contact } = this.props;
    return (
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'white', padding: 16 }}
        onPress={() => Keyboard.dismiss()}
        activeOpacity={1.0}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled
        />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          scrollEnabled
          style={{ width: '100%' }}
        >
          <View style={Styles.profileCard}>
            <View style={Styles.profileCardHeader} />
            <ProfilePic
              firstName={contact.firstName}
              lastName={contact.lastName}
              imageUri="ExamplePic"
              type={ProfilePicTypes.SingleContact}
            />
          </View>
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                fontSize: 14,
                paddingBottom: 4,
              },
            ]}
          >
            First name
          </Text>
          <Input
            ref={this.firstName}
            placeholder="First name"
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
            nextInput={this.lastName}
          />
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                fontSize: 14,
                paddingBottom: 4,
              },
            ]}
          >
            Last name
          </Text>
          <Input
            ref={this.lastName}
            placeholder="Last name"
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
            nextInput={this.facilityName}
          />
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                fontSize: 14,
                paddingBottom: 4,
              },
            ]}
          >
            Address line 1
          </Text>
          <Input
            ref={this.facilityName}
            placeholder="Address line 1"
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
            nextInput={this.facilityAddress}
          />
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                fontSize: 14,
                paddingBottom: 4,
              },
            ]}
          >
            Address Line 2
          </Text>
          <Input
            ref={this.facilityAddress}
            placeholder="Address line 2"
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />

          <Input
            ref={this.unit}
            placeholder="Unit (optional, only if needed)"
          />
          <Input
            ref={this.dorm}
            placeholder="Dorm (optional, only if needed)"
          />
        </ScrollView>
        <Button
          buttonText="Save Profile"
          enabled={this.state.valid}
          onPress={() => {
            /* TODO: Update Contact */
          }}
        />
        <Button
          buttonText="Delete Profile"
          onPress={() => {
            /* TODO: Delete Contact */
          }}
        />
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    contact: state.contact.active,
  };
};

const UpdateContactScreen = connect(mapStateToProps)(UpdateContactScreenBase);

export default UpdateContactScreen;

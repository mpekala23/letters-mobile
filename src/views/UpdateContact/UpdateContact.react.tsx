import React from 'react';
import {
  Text,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Button, Input } from '@components';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';

type UpdateContactScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'UpdateContact'
>;

export interface Props {
  navigation: UpdateContactScreenNavigationProp;
}

export interface State {
  inputting: boolean;
  valid: boolean;
}

class UpdateContactScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inputting: false,
      // valid: false,
    };
  }

  render() {
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
          scrollEnabled={this.state.inputting}
          style={{ width: '100%' }}
        >
          <Text>First name</Text>
          <Input
            // ref={this.firstName}
            // parentStyle={CommonStyles.fullWidth}
            placeholder="First name"
            required
            onFocus={() => {
              this.setState({ inputting: true });
            }}
            onBlur={() => {
              this.setState({ inputting: false });
            }}
            // onValid={this.updateValid}
            // onInvalid={() => this.setState({ valid: false })}
            // nextInput={this.lastName}
          />
          <Text>Last name</Text>
          <Input
            // ref={this.firstName}
            // parentStyle={CommonStyles.fullWidth}
            placeholder="Last name"
            required
            onFocus={() => {
              this.setState({ inputting: true });
            }}
            onBlur={() => {
              this.setState({ inputting: false });
            }}
            // onValid={this.updateValid}
            // onInvalid={() => this.setState({ valid: false })}
            // nextInput={this.lastName}
          />
          <Text>Cell phone</Text>
          <Input
            // ref={this.firstName}
            // parentStyle={CommonStyles.fullWidth}
            placeholder="Cellphone"
            required
            onFocus={() => {
              this.setState({ inputting: true });
            }}
            onBlur={() => {
              this.setState({ inputting: false });
            }}
            // onValid={this.updateValid}
            // onInvalid={() => this.setState({ valid: false })}
            // nextInput={this.lastName}
          />
          <Text>Address line 1</Text>
          <Input
            // ref={this.firstName}
            // parentStyle={CommonStyles.fullWidth}
            placeholder="Address line 1"
            required
            onFocus={() => {
              this.setState({ inputting: true });
            }}
            onBlur={() => {
              this.setState({ inputting: false });
            }}
            // onValid={this.updateValid}
            // onInvalid={() => this.setState({ valid: false })}
            // nextInput={this.lastName}
          />
          <Text>Address Line 2</Text>
          <Input
            // ref={this.firstName}
            // parentStyle={CommonStyles.fullWidth}
            placeholder="Address line 2"
            required
            onFocus={() => {
              this.setState({ inputting: true });
            }}
            onBlur={() => {
              this.setState({ inputting: false });
            }}
            // onValid={this.updateValid}
            // onInvalid={() => this.setState({ valid: false })}
            // nextInput={this.lastName}
          />
          <Button
            buttonText="Delete Profile"
            // containerStyle={{ marginBottom: 10 }}
            onPress={() => {
              /* TODO: Delete Contact */
            }}
          />
        </ScrollView>
      </TouchableOpacity>
    );
  }
}

export default UpdateContactScreen;

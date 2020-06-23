import React, { Dispatch } from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import { ComposeHeader, Input } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setMessage } from '@store/Letter/LetterActions';
import { LetterState, LetterActionTypes } from '@store/Letter/LetterTypes';
import i18n from '@i18n';
import { WINDOW_WIDTH } from '@utils';
import Styles from './Compose.styles';
import PicUpload, {
  PicUploadTypes,
} from '../../components/PicUpload/PicUpload.react';

type ComposeLetterScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ComposePostcard'
>;

interface Props {
  navigation: ComposeLetterScreenNavigationProp;
  letterState: LetterState;
  setMessage: (message: string) => void;
}

interface State {
  keyboardOpacity: Animated.Value;
  charsLeft: number;
}

class ComposePostcardScreenBase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      keyboardOpacity: new Animated.Value(0),
      charsLeft: 300,
    };
    this.updateCharsLeft = this.updateCharsLeft.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  updateCharsLeft(value: string): void {
    this.setState({ charsLeft: 300 - value.length });
  }

  changeText(value: string): void {
    this.updateCharsLeft(value);
    this.props.setMessage(value);
  }

  render(): JSX.Element {
    return (
      <TouchableOpacity
        accessible={false}
        style={{ flex: 1, backgroundColor: 'white' }}
        onPress={Keyboard.dismiss}
        activeOpacity={1.0}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled
          keyboardVerticalOffset={70}
          pointerEvents="box-none"
        >
          <View
            style={[
              Styles.screenBackground,
              {
                flex: 1,
                paddingBottom: 50,
              },
            ]}
          >
            <ComposeHeader
              recipientName={this.props.letterState.composing.recipientName}
            />
            <Input
              parentStyle={{ flex: 1 }}
              inputStyle={{
                fontSize: 18,
                flex: 1,
              }}
              onChangeText={this.changeText}
              onFocus={() => {
                Animated.timing(this.state.keyboardOpacity, {
                  toValue: 1,
                  duration: 100,
                  useNativeDriver: false,
                }).start();
              }}
              onBlur={() => {
                Animated.timing(this.state.keyboardOpacity, {
                  toValue: 0,
                  duration: 100,
                  useNativeDriver: false,
                }).start();
              }}
              placeholder={i18n.t('Compose.placeholder')}
              numLines={100}
            >
              <Animated.View
                style={[
                  {
                    opacity: this.state.keyboardOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0],
                    }),
                    height: this.state.keyboardOpacity.interpolate({
                      inputRange: [0, 0.8, 1],
                      outputRange: [200, 200, 0],
                    }),
                  },
                ]}
              >
                <PicUpload
                  type={PicUploadTypes.Media}
                  width={200}
                  height={200}
                />
              </Animated.View>
            </Input>
            <Animated.View
              style={{
                opacity: this.state.keyboardOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
                position: 'absolute',
                bottom: 0,
                width: WINDOW_WIDTH,
              }}
            >
              <TouchableOpacity style={Styles.keyboardButtonContainer}>
                <TouchableOpacity style={Styles.keyboardButtonItem}>
                  <Text>Tt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.keyboardButtonItem}>
                  <Text>`&quot;`</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.keyboardButtonItem}>
                  <Text>bullet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.keyboardButtonItem}>
                  <Text>dots</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.keyboardButtonItem}>
                  <Text>@</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[Styles.keyboardButtonItem, { flex: 1 }]}
                >
                  <Text>{this.state.charsLeft} left</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[Styles.keyboardButtonItem, { flex: 1 }]}
                >
                  <Text>pic</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  letterState: state.letter,
});
const mapDispatchToProps = (dispatch: Dispatch<LetterActionTypes>) => {
  return {
    setMessage: (message: string) => dispatch(setMessage(message)),
  };
};
const ComposePostcardScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComposePostcardScreenBase);

export default ComposePostcardScreen;

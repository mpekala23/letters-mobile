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

type ComposeLetterScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ComposeLetter'
>;

interface Props {
  navigation: ComposeLetterScreenNavigationProp;
  letterState: LetterState;
  setMessage: (message: string) => void;
}

interface State {
  keyboardOpacity: Animated.Value;
  wordsLeft: number;
}

class ComposeLetterScreenBase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      keyboardOpacity: new Animated.Value(0),
      wordsLeft: 300,
    };
    this.updateWordsLeft = this.updateWordsLeft.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  updateWordsLeft(value: string): void {
    let s = value;
    s = s.replace(/\n/g, ' '); // newlines to space
    s = s.replace(/(^\s*)|(\s*$)/gi, ''); // remove spaces from start + end
    s = s.replace(/[ ]{2,}/gi, ' '); // 2 or more spaces to 1
    const split = s.split(' ');
    let numWords = split.length;
    if (split[0] === '') {
      numWords = 0;
    }
    this.setState({ wordsLeft: 300 - numWords });
  }

  changeText(value: string): void {
    this.updateWordsLeft(value);
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
                  duration: 50,
                  useNativeDriver: false,
                }).start();
              }}
              onBlur={() => {
                Animated.timing(this.state.keyboardOpacity, {
                  toValue: 0,
                  duration: 50,
                  useNativeDriver: false,
                }).start();
              }}
              placeholder={i18n.t('Compose.placeholder')}
              numLines={100}
            />
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
                  <Text>{this.state.wordsLeft} left</Text>
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
const ComposeLetterScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComposeLetterScreenBase);

export default ComposeLetterScreen;

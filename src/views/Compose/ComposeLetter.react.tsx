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
import { ComposeHeader, Input, Button } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setDraft, setContent } from '@store/Letter/LetterActions';
import { LetterActionTypes } from '@store/Letter/LetterTypes';
import i18n from '@i18n';
import { WINDOW_WIDTH } from '@utils';
import { Typography, Colors } from '@styles';
import { Letter } from 'types';
import Styles from './Compose.styles';

type ComposeLetterScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ComposeLetter'
>;

interface Props {
  navigation: ComposeLetterScreenNavigationProp;
  composing: Letter;
  recipientName: string;
  setContent: (content: string) => void;
  setDraft: (value: boolean) => void;
}

interface State {
  keyboardOpacity: Animated.Value;
  wordsLeft: number;
}

class ComposeLetterScreenBase extends React.Component<Props, State> {
  private unsubscribeFocus: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      keyboardOpacity: new Animated.Value(0),
      wordsLeft: 300,
    };
    this.updateWordsLeft = this.updateWordsLeft.bind(this);
    this.changeText = this.changeText.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
  }

  onNavigationFocus() {
    this.props.setDraft(true);
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
    this.props.setContent(value);
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
          keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 100}
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
            <Button
              buttonText="Next Page"
              onPress={() => {
                // TODO: Once [Mobile Component Librar] Bars is done,
                // replace this with a press of the next button in the navbar
                this.props.navigation.navigate('LetterPreview');
              }}
            />
            <ComposeHeader recipientName={this.props.recipientName} />
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
              testId="input"
            />
            <Animated.View
              style={{
                opacity: this.state.keyboardOpacity,
                position: 'absolute',
                bottom: 0,
                width: WINDOW_WIDTH,
              }}
            >
              <TouchableOpacity
                activeOpacity={1.0}
                style={Styles.keyboardButtonContainer}
              >
                <View style={[Styles.keyboardButtonItem, { flex: 1 }]}>
                  <Text
                    style={[
                      Typography.FONT_REGULAR,
                      {
                        color:
                          this.state.wordsLeft >= 0
                            ? Colors.GRAY_DARK
                            : Colors.AMEELIO_RED,
                      },
                    ]}
                  >
                    {this.state.wordsLeft} left
                  </Text>
                </View>
                <TouchableOpacity
                  style={[Styles.keyboardButtonItem, { flex: 1 }]}
                  onPress={Keyboard.dismiss}
                >
                  <Text
                    style={[
                      Typography.FONT_REGULAR,
                      { color: Colors.AMEELIO_BLUE },
                    ]}
                  >
                    done
                  </Text>
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
  composing: state.letter.composing,
  recipientName: state.contact.active.firstName,
});
const mapDispatchToProps = (dispatch: Dispatch<LetterActionTypes>) => {
  return {
    setContent: (content: string) => dispatch(setContent(content)),
    setDraft: (value: boolean) => dispatch(setDraft(value)),
  };
};
const ComposeLetterScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComposeLetterScreenBase);

export default ComposeLetterScreen;

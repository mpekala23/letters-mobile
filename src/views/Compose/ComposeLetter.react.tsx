import React, { Dispatch, createRef } from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import {
  ComposeHeader,
  Input,
  ComposeTools,
  PicUpload,
  Icon,
} from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setDraft, setContent, setPhoto } from '@store/Letter/LetterActions';
import { LetterActionTypes } from '@store/Letter/LetterTypes';
import i18n from '@i18n';
import { WINDOW_WIDTH } from '@utils';
import { Typography, Colors } from '@styles';
import { Letter, Photo } from 'types';
import { PicUploadTypes } from '@components/PicUpload/PicUpload.react';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import ImageIcon from '@assets/views/Compose/Image';
import CheckIcon from '@assets/views/Compose/Check';
import { popupAlert } from '@components/Alert/Alert.react';
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
  setPhoto: (photo: Photo | undefined) => void;
}

interface State {
  keyboardOpacity: Animated.Value;
  wordsLeft: number;
}

class ComposeLetterScreenBase extends React.Component<Props, State> {
  private picRef = createRef<PicUpload>();

  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      keyboardOpacity: new Animated.Value(0),
      wordsLeft: 300,
    };
    this.updateWordsLeft = this.updateWordsLeft.bind(this);
    this.changeText = this.changeText.bind(this);
    this.registerPhoto = this.registerPhoto.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
    this.unsubscribeBlur = this.props.navigation.addListener(
      'blur',
      this.onNavigationBlur
    );
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
  }

  onNavigationFocus() {
    this.props.setDraft(true);
    setProfileOverride({
      enabled: true,
      text: i18n.t('Compose.next'),
      action: () => {
        Keyboard.dismiss();
        if (this.props.composing.content.length <= 0) {
          popupAlert({
            title: i18n.t('Compose.letterMustHaveContent'),
            buttons: [
              {
                text: i18n.t('Alert.okay'),
              },
            ],
          });
        } else {
          this.props.navigation.navigate('LetterPreview');
        }
      },
    });
  }

  onNavigationBlur = () => {
    setProfileOverride(undefined);
  };

  registerPhoto(photo: Photo): void {
    this.props.setPhoto(photo);
  }

  deletePhoto(): void {
    this.props.setPhoto(undefined);
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
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : -200}
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
            <ComposeHeader recipientName={this.props.recipientName} />
            <Input
              parentStyle={{ flex: 1 }}
              inputStyle={{
                fontSize: 18,
                flex: 1,
                textAlignVertical: 'top',
                paddingTop: 8,
              }}
              onChangeText={this.changeText}
              onFocus={() => {
                Animated.timing(this.state.keyboardOpacity, {
                  toValue: 1,
                  duration: Platform.OS === 'ios' ? 100 : 0,
                  useNativeDriver: false,
                }).start();
              }}
              onBlur={() => {
                Animated.timing(this.state.keyboardOpacity, {
                  toValue: 0,
                  duration: Platform.OS === 'ios' ? 100 : 0,
                  useNativeDriver: false,
                }).start();
              }}
              placeholder={i18n.t('Compose.placeholder')}
              numLines={100}
              testId="input"
            >
              <Animated.View
                style={[
                  {
                    opacity: this.state.keyboardOpacity.interpolate({
                      inputRange: [0, 0.1, 1],
                      outputRange: [1, 0.5, 0],
                    }),
                    height: this.state.keyboardOpacity.interpolate({
                      inputRange: [0, 0.8, 1],
                      outputRange: [200, 200, 0],
                    }),
                  },
                ]}
              >
                <PicUpload
                  ref={this.picRef}
                  onSuccess={this.registerPhoto}
                  onDelete={this.deletePhoto}
                  type={PicUploadTypes.Media}
                  width={180}
                  height={200}
                  allowsEditing={false}
                  shapeBackground={{ left: 10, bottom: 10 }}
                />
              </Animated.View>
            </Input>
            <ComposeTools
              keyboardOpacity={this.state.keyboardOpacity}
              picRef={this.picRef}
              numLeft={this.state.wordsLeft}
            />
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
    setPhoto: (photo: Photo | undefined) => dispatch(setPhoto(photo)),
    setDraft: (value: boolean) => dispatch(setDraft(value)),
  };
};
const ComposeLetterScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComposeLetterScreenBase);

export default ComposeLetterScreen;

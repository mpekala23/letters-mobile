import React, { Dispatch, createRef } from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  EmitterSubscription,
} from 'react-native';
import { ComposeHeader, Input, ComposeTools, PicUpload } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setDraft, setContent, setPhoto } from '@store/Letter/LetterActions';
import { LetterActionTypes } from '@store/Letter/LetterTypes';
import i18n from '@i18n';
import { Letter, Photo } from 'types';
import { PicUploadTypes } from '@components/PicUpload/PicUpload.react';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import { popupAlert } from '@components/Alert/Alert.react';
import { WINDOW_WIDTH } from '@utils';
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
  photoWidth: number;
  photoHeight: number;
  open: boolean;
  valid: boolean;
}

class ComposeLetterScreenBase extends React.Component<Props, State> {
  private wordRef = createRef<Input>();

  private picRef = createRef<PicUpload>();

  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  private unsubscribeKeyboardOpen: EmitterSubscription;

  private unsubscribeKeyboardClose: EmitterSubscription;

  constructor(props: Props) {
    super(props);
    this.state = {
      keyboardOpacity: new Animated.Value(0),
      wordsLeft: 300,
      photoWidth: 200,
      photoHeight: 200,
      open: false,
      valid: true,
    };
    this.updateWordsLeft = this.updateWordsLeft.bind(this);
    this.changeText = this.changeText.bind(this);
    this.registerPhoto = this.registerPhoto.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
    this.onNextPress = this.onNextPress.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.onKeyboardOpen = this.onKeyboardOpen.bind(this);
    this.onKeyboardClose = this.onKeyboardClose.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
    this.unsubscribeBlur = this.props.navigation.addListener(
      'blur',
      this.onNavigationBlur
    );
    this.unsubscribeKeyboardOpen = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      this.onKeyboardOpen
    );
    this.unsubscribeKeyboardClose = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      this.onKeyboardClose
    );
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
    this.unsubscribeKeyboardOpen.remove();
    this.unsubscribeKeyboardClose.remove();
  }

  onNavigationFocus() {
    const { photo } = this.props.composing;
    if (this.wordRef.current)
      this.wordRef.current.set(this.props.composing.content);
    if (this.picRef.current && photo && photo.width && photo.height) {
      this.picRef.current.setState({
        image: photo,
      });
      if (photo.width < photo.height) {
        this.setState({
          photoWidth: (photo.width / photo.height) * 200,
          photoHeight: 200,
        });
      } else {
        this.setState({
          photoWidth: 200,
          photoHeight: (photo.height / photo.width) * 200,
        });
      }
    } else {
      this.setState({
        photoWidth: 200,
        photoHeight: 200,
      });
    }
    this.props.setDraft(true);
    setProfileOverride({
      enabled: this.state.valid,
      text: i18n.t('Compose.next'),
      action: this.onNextPress,
    });
  }

  onNextPress(): void {
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
  }

  onNavigationBlur = () => {
    setProfileOverride(undefined);
  };

  onKeyboardOpen() {
    Animated.timing(this.state.keyboardOpacity, {
      toValue: 1,
      duration: Platform.OS === 'ios' ? 220 : 220,
      useNativeDriver: false,
    }).start();
    this.setState({ open: true });
  }

  onKeyboardClose() {
    Animated.timing(this.state.keyboardOpacity, {
      toValue: 0,
      duration: Platform.OS === 'ios' ? 220 : 220,
      useNativeDriver: false,
    }).start();
    this.setState({ open: false });
  }

  setValid(val: boolean) {
    this.setState({ valid: val });
    setProfileOverride({
      enabled: val,
      text: i18n.t('Compose.next'),
      action: this.onNextPress,
    });
  }

  registerPhoto(photo: Photo): void {
    this.props.setPhoto(photo);
    if (photo && photo.width && photo.height) {
      if (photo.width < photo.height) {
        this.setState({
          photoWidth: (photo.width / photo.height) * 200,
          photoHeight: 200,
        });
      } else {
        this.setState({
          photoWidth: 200,
          photoHeight: (photo.height / photo.width) * 200,
        });
      }
    } else {
      this.setState({
        photoWidth: 200,
        photoHeight: 200,
      });
    }
    Keyboard.dismiss();
  }

  deletePhoto(): void {
    this.props.setPhoto(undefined);
    this.setState({ photoWidth: 200, photoHeight: 200 });
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
    this.setValid(300 - numWords >= 0);
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
              ref={this.wordRef}
              parentStyle={{ flex: 1 }}
              inputStyle={{
                fontSize: 18,
                flex: 1,
                textAlignVertical: 'top',
                paddingTop: 8,
                paddingBottom: this.state.open ? 8 : this.state.photoHeight + 8,
              }}
              onChangeText={this.changeText}
              placeholder={i18n.t('Compose.placeholder')}
              numLines={100}
              testId="input"
            >
              <Animated.View
                style={{
                  position: 'absolute',
                  bottom: this.state.keyboardOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -this.state.photoHeight / 4],
                  }),
                  right: this.state.keyboardOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      WINDOW_WIDTH - 30 - this.state.photoWidth,
                      10 - this.state.photoWidth / 4,
                    ],
                  }),
                  width: this.state.photoWidth,
                  height: this.state.photoHeight,
                  transform: [
                    {
                      scale: this.state.keyboardOpacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.5],
                      }),
                    },
                  ],
                }}
              >
                <PicUpload
                  ref={this.picRef}
                  onSuccess={this.registerPhoto}
                  onDelete={this.deletePhoto}
                  type={PicUploadTypes.Media}
                  width={this.state.photoWidth}
                  height={this.state.photoHeight}
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

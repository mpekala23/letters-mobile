import React, { Dispatch, createRef } from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  Keyboard,
  Platform,
  EmitterSubscription,
} from 'react-native';
import {
  ComposeHeader,
  Input,
  ComposeTools,
  PicUpload,
  KeyboardAvoider,
} from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setContent, setImage } from '@store/Mail/MailActions';
import { MailActionTypes } from '@store/Mail/MailTypes';
import i18n from '@i18n';
import { Draft, Image, MailTypes } from 'types';
import { PicUploadTypes } from '@components/PicUpload/PicUpload.react';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import { popupAlert } from '@components/Alert/Alert.react';
import { WINDOW_WIDTH } from '@utils';
import * as Segment from 'expo-analytics-segment';
import { saveDraft } from '@api';
import Styles from './Compose.styles';

type ComposeLetterScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ComposeLetter'
>;

interface State {
  keyboardOpacity: Animated.Value;
  wordsLeft: number;
  imageWidth: number;
  imageHeight: number;
  open: boolean;
  valid: boolean;
}

interface Props {
  navigation: ComposeLetterScreenNavigationProp;
  composing: Draft;
  recipientName: string;
  hasSentMail: boolean;
  setContent: (content: string) => void;
  setImage: (image: Image | undefined) => void;
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
      wordsLeft: 2000,
      imageWidth: 200,
      imageHeight: 200,
      open: false,
      valid: true,
    };
    this.updateWordsLeft = this.updateWordsLeft.bind(this);
    this.changeText = this.changeText.bind(this);
    this.registerImage = this.registerImage.bind(this);
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
    if (this.props.composing.type === MailTypes.Postcard) {
      this.props.navigation.goBack();
      return;
    }

    const { image, content } = this.props.composing;

    if (this.wordRef.current) {
      if (!this.props.hasSentMail && !content) {
        this.wordRef.current.set(
          `${i18n.t('Compose.firstLetterGhostTextSalutation')} ${
            this.props.recipientName
          }, ${i18n.t('Compose.firstLetterGhostTextBody')}`
        );
      } else {
        this.wordRef.current.set(content);
      }
    }
    if (this.picRef.current && image && image.width && image.height) {
      this.picRef.current.setState({
        image,
      });
      if (image.width < image.height) {
        this.setState({
          imageWidth: (image.width / image.height) * 200,
          imageHeight: 200,
        });
      } else {
        this.setState({
          imageWidth: 200,
          imageHeight: (image.height / image.width) * 200,
        });
      }
    } else {
      this.setState({
        imageWidth: 200,
        imageHeight: 200,
      });
    }
    setProfileOverride({
      enabled: this.state.valid,
      text: i18n.t('Compose.next'),
      action: this.onNextPress,
    });
  }

  onNextPress(): void {
    Keyboard.dismiss();
    Segment.trackWithProperties('Compose - Click on Next', {
      type: 'letter',
    });
    if (this.props.composing.content.length <= 0) {
      Segment.trackWithProperties('Compose - Click on Next Failure', {
        type: 'letter',
        Error: 'Letter must have content',
      });
      popupAlert({
        title: i18n.t('Compose.letterMustHaveContent'),
        buttons: [
          {
            text: i18n.t('Alert.okay'),
          },
        ],
      });
    } else {
      this.props.navigation.navigate(Screens.ReviewLetter);
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
    if (val === this.state.valid) return;
    this.setState({ valid: val });
    setProfileOverride({
      enabled: val,
      text: i18n.t('Compose.next'),
      action: this.onNextPress,
    });
  }

  registerImage(image: Image): void {
    this.props.setImage(image);
    if (image && image.width && image.height) {
      if (image.width < image.height) {
        this.setState({
          imageWidth: (image.width / image.height) * 200,
          imageHeight: 200,
        });
      } else {
        this.setState({
          imageWidth: 200,
          imageHeight: (image.height / image.width) * 200,
        });
      }
    } else {
      this.setState({
        imageWidth: 200,
        imageHeight: 200,
      });
    }
    Keyboard.dismiss();
  }

  deletePhoto(): void {
    this.props.setImage(undefined);
    this.setState({ imageWidth: 200, imageHeight: 200 });
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
    this.setState({ wordsLeft: 2000 - numWords });
    this.setValid(2000 - numWords >= 0);
  }

  changeText(value: string): void {
    this.updateWordsLeft(value);
    this.props.setContent(value);
    saveDraft(this.props.composing);
  }

  render(): JSX.Element {
    return (
      <TouchableOpacity
        accessible={false}
        style={{ flex: 1, backgroundColor: 'white' }}
        onPress={Keyboard.dismiss}
        activeOpacity={1.0}
      >
        <KeyboardAvoider
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <View
            pointerEvents="box-none"
            style={[
              Styles.screenBackground,
              {
                flex: 1,
                paddingBottom: this.state.open ? 50 : undefined,
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
                paddingBottom: this.state.open ? 8 : this.state.imageHeight + 8,
              }}
              onChangeText={this.changeText}
              placeholder={i18n.t('Compose.placeholder')}
              numLines={1000}
              testId="input"
            >
              <Animated.View
                style={{
                  position: 'absolute',
                  bottom: this.state.keyboardOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -this.state.imageHeight / 4],
                  }),
                  right: this.state.keyboardOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      WINDOW_WIDTH - 30 - this.state.imageWidth,
                      10 - this.state.imageWidth / 4,
                    ],
                  }),
                  width: this.state.imageWidth,
                  height: this.state.imageHeight,
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
                  onSuccess={this.registerImage}
                  onDelete={this.deletePhoto}
                  type={PicUploadTypes.Media}
                  width={this.state.imageWidth}
                  height={this.state.imageHeight}
                  allowsEditing={false}
                  shapeBackground={{ left: 10, bottom: 10 }}
                  segmentOnPressLog={() => {
                    Segment.trackWithProperties(
                      'Compose - Click on Add Image',
                      { Option: 'Letter' }
                    );
                  }}
                  segmentSuccessLog={() => {
                    Segment.trackWithProperties('Compose - Add Image Success', {
                      Option: 'Letter',
                    });
                  }}
                  segmentErrorLogEvent="Compose - Add Image Error"
                />
              </Animated.View>
            </Input>
            <ComposeTools
              keyboardOpacity={this.state.keyboardOpacity}
              picRef={this.picRef}
              numLeft={this.state.wordsLeft}
            />
          </View>
        </KeyboardAvoider>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  composing: state.mail.composing,
  recipientName: state.contact.active.firstName,
  hasSentMail: Object.values(state.mail.existing).some(
    (mail) => mail.length > 0
  ),
});

const mapDispatchToProps = (dispatch: Dispatch<MailActionTypes>) => {
  return {
    setContent: (content: string) => dispatch(setContent(content)),
    setImage: (image: Image | undefined) => dispatch(setImage(image)),
  };
};
const ComposeLetterScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComposeLetterScreenBase);

export default ComposeLetterScreen;

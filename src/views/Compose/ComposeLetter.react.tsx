import React, { Dispatch, createRef } from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  Keyboard,
  Platform,
  EmitterSubscription,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  ComposeHeader,
  ComposeTools,
  PicUpload,
  KeyboardAvoider,
} from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setContent, setImages } from '@store/Mail/MailActions';
import { MailActionTypes } from '@store/Mail/MailTypes';
import i18n from '@i18n';
import { Draft, Image, MailTypes } from 'types';
import { PicUploadTypes } from '@components/PicUpload/PicUpload.react';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import { popupAlert } from '@components/Alert/Alert.react';
import * as Segment from 'expo-analytics-segment';
import { saveDraft } from '@api';
import Styles, { LETTER_COMPOSE_IMAGE_HEIGHT } from './Compose.styles';

type ComposeLetterScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ComposeLetter'
>;

interface State {
  keyboardOpacity: Animated.Value;
  wordsLeft: number;
  open: boolean;
  valid: boolean;
  text: string;
  images: Image[];
}

interface Props {
  navigation: ComposeLetterScreenNavigationProp;
  composing: Draft;
  recipientName: string;
  hasSentMail: boolean;
  setContent: (content: string) => void;
  setImages: (images: Image[]) => void;
}

const MAX_NUM_IMAGES = 4;

class ComposeLetterScreenBase extends React.Component<Props, State> {
  private textRef = createRef<TextInput>();

  private imageUploadRef = createRef<PicUpload>();

  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  private unsubscribeKeyboardOpen: EmitterSubscription;

  private unsubscribeKeyboardClose: EmitterSubscription;

  constructor(props: Props) {
    super(props);
    this.state = {
      keyboardOpacity: new Animated.Value(0),
      wordsLeft: 2000,
      open: false,
      valid: true,
      text: '',
      images: [],
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

    const { images, content } = this.props.composing;
    this.setState({
      text:
        !this.props.hasSentMail && !content
          ? `${i18n.t('Compose.firstLetterGhostTextSalutation')} ${
              this.props.recipientName
            }, ${i18n.t('Compose.firstLetterGhostTextBody')}`
          : content,
      images: images || [],
    });

    if (this.textRef.current) this.textRef.current.focus();

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
    this.setState(
      (prevState) => ({
        images: [...prevState.images, image],
      }),
      () => {
        this.props.setImages(this.state.images);
        saveDraft(this.props.composing);
      }
    );
    Keyboard.dismiss();
  }

  deletePhoto(imageUri: string | undefined): void {
    const deleteIndex = this.state.images.findIndex(
      (el) => el.uri === imageUri
    );
    if (deleteIndex !== -1) {
      this.setState(
        (prevState) => ({
          images: prevState.images.filter((_, i) => i !== deleteIndex),
        }),
        () => {
          this.props.setImages(this.state.images);
        }
      );
    }
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
    this.setState({ text: value });
    this.updateWordsLeft(value);
    this.props.setContent(value);
    saveDraft(this.props.composing);
  }

  renderImages = (): JSX.Element[] => {
    const images: (Image | null)[] = [...this.state.images];
    if (this.state.images.length < MAX_NUM_IMAGES) {
      const upload = null;
      images.push(upload);
    }
    return images.map((image) => {
      if (image) {
        return (
          <PicUpload
            key={image.uri}
            onSuccess={this.registerImage}
            onDelete={this.deletePhoto}
            type={PicUploadTypes.Media}
            initial={image}
            width={LETTER_COMPOSE_IMAGE_HEIGHT}
            height={LETTER_COMPOSE_IMAGE_HEIGHT}
            allowsEditing={false}
            shapeBackground={{ margin: 4 }}
          />
        );
      }
      return (
        <PicUpload
          ref={this.imageUploadRef}
          key="addNewImage"
          maintainStateImage={false}
          onSuccess={this.registerImage}
          onDelete={this.deletePhoto}
          type={PicUploadTypes.Media}
          width={LETTER_COMPOSE_IMAGE_HEIGHT}
          height={LETTER_COMPOSE_IMAGE_HEIGHT}
          allowsEditing={false}
          shapeBackground={{
            margin: 4,
            borderWidth: 2,
            borderColor: '#CCCCCC',
          }}
          segmentOnPressLog={() => {
            Segment.trackWithProperties('Compose - Click on Add Image', {
              Option: 'Letter',
            });
          }}
          segmentSuccessLog={() => {
            Segment.trackWithProperties('Compose - Add Image Success', {
              Option: 'Letter',
            });
          }}
          segmentErrorLogEvent="Compose - Add Image Error"
        />
      );
    });
  };

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
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <TextInput
                ref={this.textRef}
                placeholder={i18n.t('Compose.placeholder')}
                value={this.state.text}
                style={[
                  {
                    fontSize: 18,
                    textAlignVertical: 'top',
                    flex: 1,
                    paddingHorizontal: 8,
                    paddingTop: 10,
                    marginBottom: 16,
                  },
                ]}
                multiline
                scrollEnabled={false}
                onChangeText={this.changeText}
              />
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginHorizontal: 6,
                  marginBottom: 8,
                }}
              >
                {this.renderImages()}
              </View>
              <TouchableOpacity
                style={{ flexGrow: 1 }}
                onPress={() => {
                  if (this.textRef.current) this.textRef.current.focus();
                }}
              />
            </ScrollView>
            <ComposeTools
              keyboardOpacity={this.state.keyboardOpacity}
              picRef={
                this.state.images.length < MAX_NUM_IMAGES
                  ? this.imageUploadRef
                  : undefined
              }
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
    setImages: (images: Image[]) => dispatch(setImages(images)),
  };
};
const ComposeLetterScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComposeLetterScreenBase);

export default ComposeLetterScreen;

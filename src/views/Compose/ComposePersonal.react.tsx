import React, { createRef, Dispatch } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Keyboard,
  EmitterSubscription,
  Platform,
  ScrollView,
} from 'react-native';
import {
  KeyboardAvoider,
  ComposeDesignBottom,
  DynamicPostcard,
  ComposeTools,
  ComposeDesignButtons,
  ComposeTextButtons,
  ComposeTextBottom,
} from '@components';
import {
  PostcardDesign,
  Contact,
  Layout,
  Draft,
  Image,
  DesignBottomDetails,
  MailTypes,
  PlacedSticker,
  TextBottomDetails,
} from 'types';
import {
  setBackOverride,
  setProfileOverride,
} from '@components/Topbar/Topbar.react';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import i18n from '@i18n';
import { AppState } from '@store/types';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { setContent, setDesign } from '@store/Mail/MailActions';
import { connect } from 'react-redux';
import { saveDraft } from '@api';
import * as MediaLibrary from 'expo-media-library';
import * as Segment from 'expo-analytics-segment';
import { WINDOW_HEIGHT, STATUS_BAR_HEIGHT, getNumWords, sleep } from '@utils';
import { COMMON_LAYOUT, LAYOUTS } from '@utils/Layouts';
import { popupAlert } from '@components/Alert/Alert.react';
import {
  POSTCARD_HEIGHT,
  POSTCARD_WIDTH,
  BAR_HEIGHT,
  PERSONAL_OVERRIDE_ID,
  DESIGN_BUTTONS_HEIGHT,
  BOTTOM_HEIGHT,
} from '@utils/Constants';
import Styles from './Compose.styles';

const FLIP_DURATION = 500;
const SLIDE_DURATION = 300;

type ComposePersonalScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ComposePersonal'
>;

interface Props {
  navigation: ComposePersonalScreenNavigationProp;
  composing: Draft;
  hasSentMail: boolean;
  recipient: Contact;
  setContent: (content: string) => void;
  setDesign: (design: PostcardDesign) => void;
}

interface State {
  subscreen: 'Design' | 'Text';
  designState: {
    bottomDetails: DesignBottomDetails | null;
    bottomSlide: Animated.Value;
    layout: Layout;
    stickers: PlacedSticker[];
    commonLayout: Layout;
    flip: Animated.Value;
    animatingFlip: boolean;
    horizontal: boolean;
    mediaGranted: boolean;
    endCursor: string;
    hasNextPage: boolean;
    library: PostcardDesign[];
    activePosition: number;
    snapshot: Image | null;
  };
  textState: {
    bottomDetails: TextBottomDetails | null;
    wordsLeft: number;
    valid: boolean;
    keyboardOpacity: Animated.Value;
    bottomSlide: Animated.Value;
    buttonSlide: Animated.Value;
    writing: boolean;
  };
}

class ComposePersonalScreenBase extends React.Component<Props, State> {
  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  private unsubscribeKeyboardOpen: EmitterSubscription;

  private unsubscribeKeyboardClose: EmitterSubscription;

  private postcardRef = createRef<DynamicPostcard>();

  constructor(props: Props) {
    super(props);
    this.state = {
      subscreen: 'Design',
      designState: {
        bottomDetails: null,
        bottomSlide: new Animated.Value(0),
        layout:
          props.composing.type === MailTypes.Postcard &&
          props.composing.design.layout
            ? props.composing.design.layout
            : { ...LAYOUTS[0] },
        stickers: [],
        commonLayout: { ...COMMON_LAYOUT },
        flip: new Animated.Value(0),
        animatingFlip: false,
        horizontal: true,
        mediaGranted: true,
        endCursor: '',
        hasNextPage: true,
        library: [],
        activePosition: 1,
        snapshot: null,
      },
      textState: {
        bottomDetails: null,
        wordsLeft: 100,
        valid: true,
        keyboardOpacity: new Animated.Value(0),
        bottomSlide: new Animated.Value(0),
        buttonSlide: new Animated.Value(0),
        writing: false,
      },
    };

    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.onNavigationBlur = this.onNavigationBlur.bind(this);
    this.onKeyboardOpen = this.onKeyboardOpen.bind(this);
    this.onKeyboardClose = this.onKeyboardClose.bind(this);
    this.openDesignBottom = this.openDesignBottom.bind(this);
    this.closeDesignBottom = this.closeDesignBottom.bind(this);
    this.openTextBottom = this.openTextBottom.bind(this);
    this.closeTextBottom = this.closeTextBottom.bind(this);
    this.loadMoreImages = this.loadMoreImages.bind(this);
    this.startWriting = this.startWriting.bind(this);
    this.backWriting = this.backWriting.bind(this);
    this.doneWriting = this.doneWriting.bind(this);
    this.updateComposing = this.updateComposing.bind(this);

    this.unsubscribeFocus = this.props.navigation.addListener(
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

  async onNavigationFocus() {
    const { content } = this.props.composing;
    if (this.postcardRef.current) {
      if (!this.props.hasSentMail && !content) {
        this.postcardRef.current.set(
          `${i18n.t('Compose.firstLetterGhostTextSalutation')} ${
            this.props.recipient.firstName
          }, ${i18n.t('Compose.firstLetterGhostTextBody')}`
        );
      } else {
        this.postcardRef.current.set(content);
      }
    }
    if (!this.state.designState.library.length) {
      let finalStatus = (await MediaLibrary.getPermissionsAsync()).status;
      if (finalStatus !== 'granted') {
        finalStatus = (await MediaLibrary.requestPermissionsAsync()).status;
      }
      this.setDesignState({ mediaGranted: finalStatus === 'granted' });
      if (finalStatus === 'granted') {
        const {
          assets,
          hasNextPage,
          endCursor,
        } = await MediaLibrary.getAssetsAsync({
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        });
        const library = assets.map((value) => {
          const image: Image = {
            uri: value.uri,
            width: value.width,
            height: value.height,
          };
          const design: PostcardDesign = {
            image,
            custom: true,
          };
          return design;
        });
        this.setDesignState({ library, hasNextPage, endCursor });
      }
    }
    if (this.state.subscreen === 'Text') {
      setBackOverride({
        action: this.backWriting,
      });
      setProfileOverride({
        enabled: true,
        text: i18n.t('Compose.done'),
        action: this.doneWriting,
      });
    }
  }

  onNavigationBlur = () => {
    setBackOverride(undefined);
    setProfileOverride(undefined);
  };

  onKeyboardOpen(): void {
    this.setTextState({ writing: true }, () => {
      this.state.textState.bottomSlide.setValue(0);
      Animated.timing(this.state.textState.keyboardOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(this.state.textState.buttonSlide, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }

  onKeyboardClose(): void {
    this.setTextState({ writing: false });
    Animated.timing(this.state.textState.keyboardOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.timing(this.state.textState.buttonSlide, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  setDesignState(
    newState: {
      bottomDetails?: DesignBottomDetails | null;
      bottomSlide?: Animated.Value;
      layout?: Layout;
      stickers?: PlacedSticker[];
      commonLayout?: Layout;
      flip?: Animated.Value;
      animatingFlip?: boolean;
      horizontal?: boolean;
      mediaGranted?: boolean;
      endCursor?: string;
      hasNextPage?: boolean;
      library?: PostcardDesign[];
      activePosition?: number;
      snapshot?: Image | null;
    },
    callback?: () => void
  ) {
    this.setState(
      (prevState) => ({
        ...prevState,
        designState: {
          ...prevState.designState,
          ...newState,
        },
      }),
      callback
    );
  }

  setTextState(
    newState: {
      bottomDetails?: TextBottomDetails | null;
      wordsLeft?: number;
      valid?: boolean;
      keyboardOpacity?: Animated.Value;
      writing?: boolean;
    },
    callback?: () => void
  ) {
    this.setState(
      (prevState) => ({
        ...prevState,
        textState: {
          ...prevState.textState,
          ...newState,
        },
      }),
      callback
    );
  }

  openDesignBottom(details: DesignBottomDetails) {
    this.setDesignState({ bottomDetails: details });
    Animated.timing(this.state.designState.bottomSlide, {
      toValue: 1,
      duration: SLIDE_DURATION,
      useNativeDriver: false,
    }).start();
  }

  closeDesignBottom() {
    Animated.timing(this.state.designState.bottomSlide, {
      toValue: 0,
      duration: SLIDE_DURATION,
      useNativeDriver: false,
    }).start(() => this.setDesignState({ bottomDetails: null }));
  }

  openTextBottom(details: TextBottomDetails) {
    this.setTextState({ bottomDetails: details });
    Animated.timing(this.state.textState.bottomSlide, {
      toValue: 1,
      duration: SLIDE_DURATION,
      useNativeDriver: false,
    }).start();
  }

  closeTextBottom() {
    Animated.timing(this.state.textState.bottomSlide, {
      toValue: 0,
      duration: SLIDE_DURATION,
      useNativeDriver: false,
    }).start(() => this.setTextState({ bottomDetails: null }));
  }

  async loadMoreImages(): Promise<void> {
    if (!this.state.designState.hasNextPage) return;
    const {
      assets,
      hasNextPage,
      endCursor,
    } = await MediaLibrary.getAssetsAsync({
      after: this.state.designState.endCursor,
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    });
    const { library } = this.state.designState;
    if (!library) return;
    const designs = assets.map((value) => {
      const image: Image = {
        uri: value.uri,
        width: value.width,
        height: value.height,
      };
      const design: PostcardDesign = {
        image,
        custom: true,
      };
      return design;
    });
    const newLibrary = library.concat(designs);
    this.setDesignState({
      library: newLibrary,
      hasNextPage,
      endCursor,
    });
  }

  designsAreFilled(): boolean {
    const { layout } = this.state.designState;
    const keys = Object.keys(layout.designs);
    return keys.every((key) => layout.designs[parseInt(key, 10)]);
  }

  updateComposing() {
    this.props.setDesign({
      image:
        this.props.composing.type === MailTypes.Postcard
          ? this.props.composing.design.image
          : { uri: '' },
      custom: true,
      layout: this.state.designState.layout,
      categoryId: PERSONAL_OVERRIDE_ID,
    });
    saveDraft(this.props.composing);
  }

  startWriting() {
    if (!this.designsAreFilled()) {
      popupAlert({
        title: i18n.t('Alert.imagesNotFilled'),
        message: i18n.t('Alert.fillAllImages'),
        buttons: [
          {
            text: i18n.t('Alert.okay'),
          },
        ],
      });
      return;
    }
    if (this.postcardRef.current) {
      this.postcardRef.current.getSnapshot().then((snapshot) => {
        this.setDesignState({ snapshot });
        if (snapshot) {
          this.props.setDesign({
            image: snapshot,
            custom: true,
            layout: this.state.designState.layout,
            categoryId: PERSONAL_OVERRIDE_ID,
          });
          saveDraft(this.props.composing);
        }
      });
    }
    this.setDesignState({ animatingFlip: true });
    Animated.timing(this.state.designState.flip, {
      toValue: 1,
      duration: FLIP_DURATION,
      useNativeDriver: false,
    }).start(() => {
      this.setState({ subscreen: 'Text' });
      this.setDesignState({ animatingFlip: false });
    });
    Animated.timing(this.state.textState.buttonSlide, {
      toValue: 1,
      duration: FLIP_DURATION,
      useNativeDriver: false,
    }).start();
    setBackOverride({
      action: this.backWriting,
    });
    setProfileOverride({
      enabled: true,
      text: i18n.t('Compose.done'),
      action: this.doneWriting,
    });
  }

  backWriting() {
    Animated.timing(this.state.designState.flip, {
      toValue: 0,
      duration: FLIP_DURATION,
      useNativeDriver: false,
    }).start(() => {
      this.setState({ subscreen: 'Design' });
      this.setDesignState({ animatingFlip: false });
    });
    Animated.timing(this.state.textState.buttonSlide, {
      toValue: 0,
      duration: FLIP_DURATION,
      useNativeDriver: false,
    }).start();
    this.setDesignState({ animatingFlip: true });
    setBackOverride(undefined);
    setProfileOverride(undefined);
  }

  doneWriting(): void {
    if (!this.props.composing.content.length) {
      Segment.trackWithProperties('Compose - Click on Next Failure', {
        type: 'postcard',
        Error: 'Letter must have content',
      });
      popupAlert({
        title: i18n.t('Compose.letterMustHaveContent'),
        buttons: [{ text: i18n.t('Alert.okay') }],
      });
      return;
    }
    this.props.navigation.navigate(Screens.ReviewPostcard, {
      category: 'New personal compose',
    });
  }

  render() {
    let dynamicTop;
    if (this.state.subscreen === 'Design') {
      dynamicTop = this.state.designState.bottomSlide.interpolate({
        inputRange: [0, 1],
        outputRange: [
          (WINDOW_HEIGHT -
            DESIGN_BUTTONS_HEIGHT -
            BAR_HEIGHT -
            POSTCARD_HEIGHT -
            STATUS_BAR_HEIGHT) /
            2,
          (WINDOW_HEIGHT -
            BOTTOM_HEIGHT -
            POSTCARD_HEIGHT -
            BAR_HEIGHT -
            STATUS_BAR_HEIGHT) /
            2,
        ],
      });
    } else if (!this.state.textState.writing) {
      dynamicTop = this.state.textState.bottomSlide.interpolate({
        inputRange: [0, 1],
        outputRange: [
          (WINDOW_HEIGHT -
            DESIGN_BUTTONS_HEIGHT -
            BAR_HEIGHT -
            POSTCARD_HEIGHT -
            STATUS_BAR_HEIGHT) /
            2,
          (WINDOW_HEIGHT -
            BOTTOM_HEIGHT -
            POSTCARD_HEIGHT -
            BAR_HEIGHT -
            STATUS_BAR_HEIGHT) /
            2,
        ],
      });
    } else {
      dynamicTop = this.state.textState.keyboardOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [
          (WINDOW_HEIGHT -
            DESIGN_BUTTONS_HEIGHT -
            BAR_HEIGHT -
            POSTCARD_HEIGHT -
            STATUS_BAR_HEIGHT) /
            2,
          (WINDOW_HEIGHT -
            BOTTOM_HEIGHT -
            POSTCARD_HEIGHT -
            BAR_HEIGHT -
            STATUS_BAR_HEIGHT) /
            2,
        ],
      });
    }
    return (
      <>
        <TouchableOpacity
          style={[Styles.screenBackground, { paddingHorizontal: 0 }]}
          activeOpacity={1.0}
          onPress={Keyboard.dismiss}
        >
          <KeyboardAvoider>
            <View style={{ flex: 1 }}>
              <ScrollView
                style={{
                  paddingHorizontal: 16,
                }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={this.state.subscreen === 'Text'}
              >
                <Animated.View
                  style={{
                    paddingBottom: 56,
                    paddingTop: dynamicTop,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <DynamicPostcard
                    ref={this.postcardRef}
                    layout={this.state.designState.layout}
                    stickers={this.state.designState.stickers}
                    activePosition={this.state.designState.activePosition}
                    highlightActive={
                      this.state.designState.bottomDetails === 'design'
                    }
                    commonLayout={this.state.designState.commonLayout}
                    onImageAdd={(position: number) => {
                      this.setDesignState({ activePosition: position });
                      this.openDesignBottom('design');
                    }}
                    flip={this.state.designState.flip}
                    onChangeText={(text) => {
                      this.props.setContent(text);
                      saveDraft(this.props.composing);
                      const numWords = getNumWords(text);
                      this.setTextState({ wordsLeft: 100 - numWords });
                    }}
                    recipient={this.props.recipient}
                    width={POSTCARD_WIDTH}
                    height={POSTCARD_HEIGHT}
                    bottomDetails={this.state.designState.bottomDetails}
                    updateStickers={(stickers) => {
                      this.setDesignState({ stickers });
                      if (this.props.composing.type === MailTypes.Postcard)
                        this.props.setDesign({
                          ...this.props.composing.design,
                          stickers,
                        });
                    }}
                  />
                </Animated.View>
              </ScrollView>
              <ComposeTools
                keyboardOpacity={this.state.textState.keyboardOpacity}
                numLeft={this.state.textState.wordsLeft}
              />
              {(this.state.subscreen === 'Design' ||
                this.state.designState.animatingFlip) && (
                <ComposeDesignButtons
                  onAddLayout={() => this.openDesignBottom('layout')}
                  onAddPhoto={() => this.openDesignBottom('design')}
                  onAddStickers={() => this.openDesignBottom('stickers')}
                  startWriting={this.startWriting}
                  flip={this.state.designState.flip}
                />
              )}
              {(this.state.subscreen === 'Text' ||
                this.state.designState.animatingFlip) &&
                !this.state.textState.writing && (
                  <ComposeTextButtons
                    onAddColor={() => this.openTextBottom('color')}
                    onAddFont={() => this.openTextBottom('font')}
                    onAddText={() => {
                      this.setTextState({ writing: true }, () => {
                        this.state.textState.bottomSlide.setValue(0);
                        if (this.postcardRef.current) {
                          this.postcardRef.current.focus();
                        }
                      });
                    }}
                    slide={this.state.textState.buttonSlide}
                    finishWriting={this.doneWriting}
                  />
                )}
              <ComposeDesignBottom
                bottomSlide={this.state.designState.bottomSlide}
                details={this.state.designState.bottomDetails}
                onClose={this.closeDesignBottom}
                onLayoutSelected={(layout) => {
                  const keys = Object.keys(layout.designs);
                  const oldLayout = this.state.designState.layout;
                  const { commonLayout } = this.state.designState;
                  const newLayout = { ...layout };
                  keys.forEach((key) => {
                    const nKey = parseInt(key, 10);
                    if (
                      Object.prototype.hasOwnProperty.call(
                        oldLayout.designs,
                        nKey
                      )
                    ) {
                      newLayout.designs[nKey] = oldLayout.designs[nKey];
                    } else {
                      newLayout.designs[nKey] = commonLayout.designs[nKey];
                    }
                  });
                  this.setDesignState(
                    { layout: newLayout },
                    this.updateComposing
                  );
                }}
                onStickerSelected={(sticker) => {
                  if (this.postcardRef.current) {
                    this.postcardRef.current.addSticker(sticker);
                  }
                  this.closeDesignBottom();
                }}
                library={this.state.designState.library}
                onDesignSelected={(design: PostcardDesign) => {
                  const layout = { ...this.state.designState.layout };
                  const commonLayout = { ...this.state.designState.layout };
                  const { activePosition } = this.state.designState;
                  layout.designs[activePosition] = design;
                  commonLayout.designs[activePosition] = design;
                  this.setDesignState(
                    {
                      layout,
                      commonLayout,
                    },
                    this.updateComposing
                  );
                }}
                loadMoreImages={this.loadMoreImages}
              />
              <ComposeTextBottom
                bottomSlide={this.state.textState.bottomSlide}
                details={this.state.textState.bottomDetails}
                onClose={this.closeTextBottom}
              />
            </View>
          </KeyboardAvoider>
        </TouchableOpacity>
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  composing: state.mail.composing,
  hasSentMail: Object.values(state.mail.existing).some(
    (mail) => mail.length > 0
  ),
  recipient: state.contact.active,
});

const mapDisptatchToProps = (dispatch: Dispatch<MailActionTypes>) => ({
  setContent: (content: string) => dispatch(setContent(content)),
  setDesign: (design: PostcardDesign) => dispatch(setDesign(design)),
});

const ComposePersonalScreen = connect(
  mapStateToProps,
  mapDisptatchToProps
)(ComposePersonalScreenBase);

export default ComposePersonalScreen;

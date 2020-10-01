import React, { createRef, Dispatch } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  Keyboard,
  EmitterSubscription,
  Platform,
  Image as ImageComponent,
  ScrollView,
} from 'react-native';
import {
  KeyboardAvoider,
  Button,
  PostcardTools,
  Icon,
  DynamicPostcard,
  ComposeTools,
} from '@components';
import {
  PostcardDesign,
  Contact,
  Layout,
  Draft,
  Image,
  Sticker,
  ComposeBottomDetails,
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
import * as MediaLibrary from 'expo-media-library';
import AsyncImage from '@components/AsyncImage/AsyncImage.react';
import * as Segment from 'expo-analytics-segment';
import Loading from '@assets/common/loading.gif';
import {
  WINDOW_WIDTH,
  takeImage,
  capitalize,
  WINDOW_HEIGHT,
  STATUS_BAR_HEIGHT,
  getNumWords,
} from '@utils';
import { Typography, Colors } from '@styles';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { COMMON_LAYOUT, LAYOUTS } from '@utils/Layouts';
import { popupAlert } from '@components/Alert/Alert.react';
import STICKERS from '@assets/stickers';
import { POSTCARD_HEIGHT, POSTCARD_WIDTH, BAR_HEIGHT } from '@utils/Constants';
import Styles, { BOTTOM_HEIGHT, DESIGN_BUTTONS_HEIGHT } from './Compose.styles';

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
    bottomDetails: ComposeBottomDetails | null;
    bottomSlide: Animated.Value;
    layout: Layout;
    commonLayout: Layout;
    design: PostcardDesign;
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
    wordsLeft: number;
    valid: boolean;
    keyboardOpacity: Animated.Value;
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
        layout: { ...LAYOUTS[0] },
        commonLayout: { ...COMMON_LAYOUT },
        design: { image: { uri: '' } },
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
        wordsLeft: 100,
        valid: true,
        keyboardOpacity: new Animated.Value(0),
      },
    };

    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.onNavigationBlur = this.onNavigationBlur.bind(this);
    this.onKeyboardOpen = this.onKeyboardOpen.bind(this);
    this.onKeyboardClose = this.onKeyboardClose.bind(this);
    this.openBottom = this.openBottom.bind(this);
    this.closeBottom = this.closeBottom.bind(this);
    this.loadMoreImages = this.loadMoreImages.bind(this);
    this.startWriting = this.startWriting.bind(this);
    this.backWriting = this.backWriting.bind(this);
    this.doneWriting = this.doneWriting.bind(this);
    this.renderStickerItem = this.renderStickerItem.bind(this);

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
  };

  onKeyboardOpen(): void {
    Animated.timing(this.state.textState.keyboardOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  onKeyboardClose(): void {
    Animated.timing(this.state.textState.keyboardOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  setDesignState(newState: {
    bottomDetails?: ComposeBottomDetails | null;
    bottomSlide?: Animated.Value;
    layout?: Layout;
    commonLayout?: Layout;
    design?: PostcardDesign;
    flip?: Animated.Value;
    animatingFlip?: boolean;
    horizontal?: boolean;
    mediaGranted?: boolean;
    endCursor?: string;
    hasNextPage?: boolean;
    library?: PostcardDesign[];
    activePosition?: number;
    snapshot?: Image | null;
  }) {
    this.setState((prevState) => ({
      ...prevState,
      designState: {
        ...prevState.designState,
        ...newState,
      },
    }));
  }

  setTextState(newState: {
    wordsLeft?: number;
    valid?: boolean;
    keyboardOpacity?: Animated.Value;
  }) {
    this.setState((prevState) => ({
      ...prevState,
      textState: {
        ...prevState.textState,
        ...newState,
      },
    }));
  }

  openBottom(details: ComposeBottomDetails) {
    this.setDesignState({ bottomDetails: details });
    Animated.timing(this.state.designState.bottomSlide, {
      toValue: 1,
      duration: SLIDE_DURATION,
      useNativeDriver: false,
    }).start();
  }

  closeBottom() {
    Animated.timing(this.state.designState.bottomSlide, {
      toValue: 0,
      duration: SLIDE_DURATION,
      useNativeDriver: false,
    }).start(() => this.setDesignState({ bottomDetails: null }));
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
          });
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
      if (this.postcardRef.current) {
        this.postcardRef.current.focus();
      }
    });
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

  renderDesignButtons = (): JSX.Element => {
    const middle =
      this.state.subscreen !== 'Design' &&
      !this.state.designState.animatingFlip ? (
        <View />
      ) : (
        <>
          <PostcardTools
            onAddLayout={() => this.openBottom('layout')}
            onAddPhoto={() => this.openBottom('design')}
            onAddStickers={() => this.openBottom('stickers')}
            style={{ paddingBottom: 16 }}
          />
          <Button
            onPress={this.startWriting}
            buttonText={i18n.t('Compose.next')}
          />
        </>
      );
    return (
      <Animated.View
        style={[
          Styles.designButtons,
          {
            bottom: this.state.designState.flip.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -2 * DESIGN_BUTTONS_HEIGHT],
            }),
            overflow: 'hidden',
          },
        ]}
      >
        {middle}
      </Animated.View>
    );
  };

  renderSubcategorySelector = (): JSX.Element => {
    const subcategories = ['Library', 'Take Photo'];
    return (
      <View style={[Styles.subcategorySelectorBackground, { marginTop: 16 }]}>
        {subcategories.map((subcategory) => (
          <TouchableOpacity
            style={[
              Styles.subcategory,
              {
                borderBottomColor:
                  subcategory === 'Library' ? 'white' : '#505050',
              },
            ]}
            onPress={async () => {
              Segment.trackWithProperties(
                'Compose - Click on Subcategory Option',
                { subcategory }
              );
              if (subcategory === 'Take Photo') {
                try {
                  const image = await takeImage({
                    aspect: [6, 4],
                    allowsEditing: true,
                  });
                  if (image) {
                    const layout = { ...this.state.designState.layout };
                    const commonLayout = { ...this.state.designState.layout };
                    const { activePosition } = this.state.designState;
                    layout.designs[activePosition] = { image };
                    commonLayout.designs[activePosition] = { image };
                    this.setDesignState({
                      layout,
                      commonLayout,
                    });
                  }
                } catch (err) {
                  dropdownError({ message: i18n.t('Permission.camera') });
                }
              }
            }}
            key={subcategory}
          >
            <Text
              style={[
                Typography.FONT_MEDIUM,
                Styles.subcategoryText,
                {
                  color:
                    subcategory === 'Library' ? 'white' : Colors.GRAY_MEDIUM,
                },
              ]}
            >
              {capitalize(subcategory)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  renderGridItem(design: PostcardDesign): JSX.Element {
    return (
      <TouchableOpacity
        style={{
          width: (WINDOW_WIDTH - 32) / 3,
          height: (WINDOW_WIDTH - 32) / 3,
          margin: 4,
        }}
        onPress={() => {
          const layout = { ...this.state.designState.layout };
          const commonLayout = { ...this.state.designState.layout };
          const { activePosition } = this.state.designState;
          layout.designs[activePosition] = design;
          commonLayout.designs[activePosition] = design;
          this.setDesignState({
            layout,
            commonLayout,
          });
        }}
      >
        <AsyncImage
          source={design.thumbnail ? design.thumbnail : design.image}
          imageStyle={{ flex: 1, aspectRatio: 1 }}
          autorotate={false}
        />
      </TouchableOpacity>
    );
  }

  renderLayoutItem(layout: Layout): JSX.Element {
    return (
      <TouchableOpacity
        style={{
          width: (WINDOW_WIDTH - 32) / 2,
          height: WINDOW_HEIGHT * 0.2 - 16,
          margin: 4,
        }}
        onPress={() => {
          const keys = Object.keys(layout.designs);
          const oldLayout = this.state.designState.layout;
          const { commonLayout } = this.state.designState;
          const newLayout = { ...layout };
          keys.forEach((key) => {
            const nKey = parseInt(key, 10);
            if (Object.prototype.hasOwnProperty.call(oldLayout.designs, nKey)) {
              newLayout.designs[nKey] = oldLayout.designs[nKey];
            } else {
              newLayout.designs[nKey] = commonLayout.designs[nKey];
            }
          });
          this.setDesignState({ layout: newLayout });
        }}
      >
        <Icon svg={layout.svg} />
      </TouchableOpacity>
    );
  }

  renderStickerItem(sticker: Sticker) {
    return (
      <TouchableOpacity
        style={{
          width: (WINDOW_WIDTH - 64) / 3,
          height: WINDOW_HEIGHT * 0.2 - 16,
          margin: 4,
          borderRadius: 8,
        }}
        onPress={() => {
          if (this.postcardRef.current) {
            this.postcardRef.current.addSticker(sticker);
          }
          this.closeBottom();
        }}
      >
        {sticker.component}
      </TouchableOpacity>
    );
  }

  renderBottomContent = (): JSX.Element => {
    const emptyLoading = (
      <View
        style={{
          flex: 1,
          height: 300,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ImageComponent style={{ width: 40, height: 40 }} source={Loading} />
      </View>
    );
    if (this.state.designState.bottomDetails === 'layout') {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            paddingTop: 4,
          }}
        >
          <Text
            style={[Typography.FONT_REGULAR, { color: 'white', fontSize: 18 }]}
          >
            {i18n.t('Compose.layouts')}
          </Text>
          <FlatList
            data={LAYOUTS}
            renderItem={({ item }) => this.renderLayoutItem(item)}
            keyExtractor={(item: Layout) => {
              return item.id.toString();
            }}
            numColumns={2}
            contentContainerStyle={Styles.gridBackground}
          />
        </View>
      );
    }
    if (this.state.designState.bottomDetails === 'stickers') {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            paddingTop: 4,
          }}
        >
          <Text
            style={[Typography.FONT_REGULAR, { color: 'white', fontSize: 18 }]}
          >
            {i18n.t('Compose.stickers')}
          </Text>
          <FlatList
            data={STICKERS}
            renderItem={({ item }) => this.renderStickerItem(item)}
            keyExtractor={(item: Sticker) => {
              return item.name;
            }}
            numColumns={3}
            contentContainerStyle={Styles.gridBackground}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    }
    return (
      <>
        {this.renderSubcategorySelector()}
        <FlatList
          data={this.state.designState.library}
          renderItem={({ item }) => this.renderGridItem(item)}
          keyExtractor={(item: PostcardDesign, index: number) => {
            return `${item.image.uri} ${index.toString()}`;
          }}
          numColumns={3}
          contentContainerStyle={Styles.gridBackground}
          onEndReached={this.loadMoreImages}
          ListEmptyComponent={emptyLoading}
        />
      </>
    );
  };

  renderBottom = (): JSX.Element => {
    return (
      <Animated.View
        style={[
          Styles.bottom,
          {
            bottom: this.state.designState.bottomSlide.interpolate({
              inputRange: [0, 1],
              outputRange: [-BOTTOM_HEIGHT, 0],
            }),
          },
        ]}
      >
        {this.renderBottomContent()}
        <TouchableOpacity
          style={{ position: 'absolute', top: 4, right: 8 }}
          onPress={this.closeBottom}
        >
          <Text
            style={[
              Typography.FONT_REGULAR,
              {
                color: 'white',
                fontSize: 18,
              },
            ]}
          >
            {i18n.t('Compose.done')}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  render() {
    return (
      <>
        <TouchableOpacity
          style={[Styles.screenBackground, { paddingHorizontal: 0 }]}
          activeOpacity={1.0}
          onPress={Keyboard.dismiss}
        >
          <KeyboardAvoider>
            <ScrollView
              style={{
                paddingHorizontal: 16,
              }}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View
                style={{
                  paddingTop:
                    this.state.subscreen === 'Design'
                      ? this.state.designState.bottomSlide.interpolate({
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
                        })
                      : this.state.textState.keyboardOpacity.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            (WINDOW_HEIGHT -
                              DESIGN_BUTTONS_HEIGHT -
                              BAR_HEIGHT -
                              POSTCARD_HEIGHT -
                              STATUS_BAR_HEIGHT) /
                              2,
                            Math.min(
                              (WINDOW_HEIGHT -
                                DESIGN_BUTTONS_HEIGHT -
                                BAR_HEIGHT -
                                POSTCARD_HEIGHT -
                                STATUS_BAR_HEIGHT) /
                                2,
                              16
                            ),
                          ],
                        }),
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <DynamicPostcard
                  ref={this.postcardRef}
                  layout={this.state.designState.layout}
                  activePosition={this.state.designState.activePosition}
                  highlightActive={
                    this.state.designState.bottomDetails === 'design'
                  }
                  commonLayout={this.state.designState.commonLayout}
                  onImageAdd={(position: number) => {
                    this.setDesignState({ activePosition: position });
                    this.openBottom('design');
                  }}
                  flip={this.state.designState.flip}
                  onChangeText={(text) => {
                    this.props.setContent(text);
                    const numWords = getNumWords(text);
                    this.setTextState({ wordsLeft: 100 - numWords });
                  }}
                  recipient={this.props.recipient}
                  width={POSTCARD_WIDTH}
                  height={POSTCARD_HEIGHT}
                  bottomDetails={this.state.designState.bottomDetails}
                />
              </Animated.View>
            </ScrollView>
            <ComposeTools
              keyboardOpacity={this.state.textState.keyboardOpacity}
              numLeft={this.state.textState.wordsLeft}
            />
            {this.renderDesignButtons()}
            {this.renderBottom()}
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

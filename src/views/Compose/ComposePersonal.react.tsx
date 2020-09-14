import React, { Dispatch } from 'react';
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
} from 'react-native';
import {
  KeyboardAvoider,
  Button,
  PostcardTools,
  Input,
  EditablePostcard,
  Icon,
  DynamicPostcard,
} from '@components';
import { PostcardDesign, Contact, Layout, Draft, Image } from 'types';
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
import AsyncImage from '@components/AsyncImage/AsyncImage.react';
import * as Segment from 'expo-analytics-segment';
import Loading from '@assets/common/loading.gif';
import { string } from 'prop-types';
import { WINDOW_WIDTH, takeImage, capitalize, WINDOW_HEIGHT } from '@utils';
import { Typography, Colors } from '@styles';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { COMMON_LAYOUT, LAYOUTS } from '@utils/Layouts';
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
    bottomDetails: 'layout' | 'design' | null;
    bottomSlide: Animated.Value;
    layout: Layout;
    commonLayout: Layout;
    design: PostcardDesign;
    flip: Animated.Value;
    horizontal: boolean;
    mediaGranted: boolean;
    endCursor: string;
    hasNextPage: boolean;
    library: PostcardDesign[];
    activePosition: number;
  };
  textState: {
    charsLeft: number;
    valid: boolean;
    keyboardOpacity: Animated.Value;
  };
}

class ComposePersonalScreenBase extends React.Component<Props, State> {
  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  private unsubscribeKeyboardOpen: EmitterSubscription;

  private unsubscribeKeyboardClose: EmitterSubscription;

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
        horizontal: true,
        mediaGranted: true,
        endCursor: '',
        hasNextPage: true,
        library: [],
        activePosition: 1,
      },
      textState: {
        charsLeft: 300,
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

  componentDidMount() {}

  componentWillUnmount() {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
    this.unsubscribeKeyboardOpen.remove();
    this.unsubscribeKeyboardClose.remove();
  }

  async onNavigationFocus() {
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

  onNavigationBlur() {}

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
    bottomDetails?: 'layout' | 'design' | null;
    bottomSlide?: Animated.Value;
    layout?: Layout;
    commonLayout?: Layout;
    design?: PostcardDesign;
    flip?: Animated.Value;
    horizontal?: boolean;
    mediaGranted?: boolean;
    endCursor?: string;
    hasNextPage?: boolean;
    library?: PostcardDesign[];
    activePosition?: number;
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
    charsLeft: number;
    valid: boolean;
    keyboardOpacity: Animated.Value;
  }) {
    this.setState((prevState) => ({
      ...prevState,
      textState: {
        ...prevState.textState,
        ...newState,
      },
    }));
  }

  openBottom(details: 'layout' | 'design') {
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

  renderDesignButtons = (): JSX.Element => {
    return (
      <Animated.View
        style={[
          Styles.designButtons,
          {
            bottom: this.state.textState.keyboardOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -DESIGN_BUTTONS_HEIGHT],
            }),
          },
        ]}
      >
        <PostcardTools
          onAddLayout={() => this.openBottom('layout')}
          onAddPhoto={() => this.openBottom('design')}
          onAddStickers={() => null}
          style={{ paddingBottom: 16 }}
        />
        <Button
          onPress={() => {
            Animated.timing(this.state.designState.flip, {
              toValue: 1,
              duration: FLIP_DURATION,
              useNativeDriver: false,
            }).start();
          }}
          buttonText={i18n.t('Compose.next')}
        />
      </Animated.View>
    );
  };

  renderSubcategorySelector = (): JSX.Element => {
    const subcategories = ['Library', 'Take Photo'];
    return (
      <View style={[Styles.subcategorySelectorBackground, { marginTop: 32 }]}>
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
                    /* this.changeDesign({
                      image,
                      custom: true,
                      name: 'Personal Photo',
                      subcategoryName: 'Selfie',
                    }); */
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
          layout.positions[activePosition] = design;
          commonLayout.positions[activePosition] = design;
          this.setDesignState({
            layout,
            commonLayout,
          });
        }}
      >
        <AsyncImage
          source={design.thumbnail ? design.thumbnail : design.image}
          imageStyle={{ flex: 1, aspectRatio: 1 }}
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
          const keys = Object.keys(layout.positions);
          const oldLayout = this.state.designState.layout;
          const { commonLayout } = this.state.designState;
          const newLayout = { ...layout };
          keys.forEach((key) => {
            const nKey = parseInt(key, 10);
            if (oldLayout.positions.hasOwnProperty(nKey)) {
              newLayout.positions[nKey] = oldLayout.positions[nKey];
            } else {
              newLayout.positions[nKey] = commonLayout.positions[nKey];
            }
          });
          this.setDesignState({ layout });
        }}
      >
        <Icon svg={layout.svg} />
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
            paddingTop: 8,
          }}
        >
          <Text
            style={[Typography.FONT_REGULAR, { color: 'white', fontSize: 18 }]}
          >
            Layouts
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
    return (
      <>
        {this.renderSubcategorySelector()}
        <FlatList
          data={this.state.designState.library}
          renderItem={({ item }) => this.renderGridItem(item)}
          keyExtractor={(item: PostcardDesign, index: number) => {
            return item.image.uri + index.toString();
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
          style={{ position: 'absolute', top: 8, right: 8 }}
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
          style={Styles.screenBackground}
          activeOpacity={1.0}
          onPress={Keyboard.dismiss}
        >
          <KeyboardAvoider>
            <View
              style={{
                flex: 1,
                paddingBottom: DESIGN_BUTTONS_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <DynamicPostcard
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
                onChangeText={() => null}
                recipient={this.props.recipient}
                width={WINDOW_WIDTH - 32}
                height={WINDOW_HEIGHT * 0.35}
              />
              <Animated.View
                style={{
                  width: WINDOW_WIDTH,
                  height: this.state.designState.bottomSlide.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, BOTTOM_HEIGHT - DESIGN_BUTTONS_HEIGHT],
                  }),
                }}
              />
            </View>
          </KeyboardAvoider>
          {this.renderDesignButtons()}
          {this.renderBottom()}
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

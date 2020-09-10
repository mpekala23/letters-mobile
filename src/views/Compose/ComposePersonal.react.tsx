import React from 'react';
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
import { WINDOW_WIDTH, takeImage, capitalize } from '@utils';
import { Typography, Colors } from '@styles';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import Styles from './Compose.styles';

const FLIP_DURATION = 500;
const SLIDE_DURATION = 500;

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
    design: PostcardDesign;
    flip: Animated.Value;
    horizontal: boolean;
    mediaGranted: boolean;
    endCursor: string;
    hasNextPage: boolean;
    library: PostcardDesign[];
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
        layout: { image: { uri: '' } },
        design: { image: { uri: '' } },
        flip: new Animated.Value(0),
        horizontal: true,
        mediaGranted: true,
        endCursor: '',
        hasNextPage: true,
        library: [],
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
    design?: PostcardDesign;
    flip?: Animated.Value;
    horizontal?: boolean;
    mediaGranted?: boolean;
    endCursor?: string;
    hasNextPage?: boolean;
    library?: PostcardDesign[];
  }) {
    this.setState((prevState) => ({
      ...prevState,
      designState: {
        ...prevState.designState,
        newState,
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
        newState,
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
    this.setDesignState({ bottomDetails: null });
    Animated.timing(this.state.designState.bottomSlide, {
      toValue: 0,
      duration: SLIDE_DURATION,
      useNativeDriver: false,
    }).start();
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
              outputRange: [0, -200],
            }),
          },
        ]}
      >
        <PostcardTools
          onAddLayout={() => this.openBottom('layout')}
          onAddPhoto={() => null}
          onAddStickers={() => null}
          style={{ paddingBottom: 16 }}
        />
        <Button onPress={() => undefined} buttonText={i18n.t('Compose.next')} />
      </Animated.View>
    );
  };

  renderSubcategorySelector = (): JSX.Element => {
    const subcategories = ['Library', 'Take Photo'];
    return (
      <View style={Styles.subcategorySelectorBackground}>
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
        onPress={() => console.log(this.state.designState.design)}
      >
        <AsyncImage
          source={design.thumbnail ? design.thumbnail : design.image}
          imageStyle={{ flex: 1, aspectRatio: 1 }}
        />
      </TouchableOpacity>
    );
  }

  renderBottom = (): JSX.Element => {
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
    return (
      <Animated.View
        style={[
          Styles.bottom,
          {
            bottom: this.state.designState.bottomSlide.interpolate({
              inputRange: [0, 1],
              outputRange: [-400, 0],
            }),
          },
        ]}
      >
        <Text
          style={[
            Typography.FONT_REGULAR,
            {
              color: 'white',
              fontSize: 18,
              position: 'absolute',
              top: 8,
              right: 8,
            },
          ]}
          onPress={this.closeBottom}
        >
          {i18n.t('Compose.done')}
        </Text>
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
            <View style={{ flex: 1 }}>
              <EditablePostcard
                design={this.state.designState.design}
                recipient={this.props.recipient}
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

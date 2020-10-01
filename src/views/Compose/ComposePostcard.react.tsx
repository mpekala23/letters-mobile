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
import { EditablePostcard, ComposeTools, KeyboardAvoider } from '@components';
import {
  PostcardDesign,
  Draft,
  Image,
  Category,
  Contact,
  MailTypes,
} from 'types';
import { Typography, Colors } from '@styles';
import { WINDOW_WIDTH, takeImage, capitalize, getNumWords } from '@utils';
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
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { popupAlert } from '@components/Alert/Alert.react';
import AsyncImage from '@components/AsyncImage/AsyncImage.react';
import * as Segment from 'expo-analytics-segment';
import Loading from '@assets/common/loading.gif';
import { POSTCARD_WIDTH, POSTCARD_HEIGHT } from '@utils/Constants';
import Styles, { BOTTOM_HEIGHT } from './Compose.styles';

const FLIP_DURATION = 500;

type ComposePostcardScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ComposePostcard'
>;

interface Props {
  navigation: ComposePostcardScreenNavigationProp;
  route: {
    params: {
      category: Category;
    };
  };
  initialSubcategory: string;
  composing: Draft;
  hasSentMail: boolean;
  recipient: Contact;
  setContent: (content: string) => void;
  setDesign: (design: PostcardDesign) => void;
}

interface State {
  subcategory: string;
  design: PostcardDesign;
  loading: PostcardDesign | null;
  writing: boolean;
  flip: Animated.Value;
  keyboardOpacity: Animated.Value;
  wordsLeft: number;
  valid: boolean;
  mediaGranted: boolean;
  renderMethod: 'grid' | 'bars';
  horizontal: boolean;
  endCursor: string;
  hasNextPage: boolean;
}

class ComposePostcardScreenBase extends React.Component<Props, State> {
  static defaultProps = {
    initialSubcategory: 'Prison Art',
  };

  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  private unsubscribeKeyboardOpen: EmitterSubscription;

  private unsubscribeKeyboardClose: EmitterSubscription;

  private editableRef = createRef<EditablePostcard>();

  constructor(props: Props) {
    super(props);
    this.state = {
      subcategory: props.initialSubcategory,
      design: {
        image: { uri: '' },
      },
      writing: false,
      flip: new Animated.Value(0),
      keyboardOpacity: new Animated.Value(0),
      wordsLeft: 100,
      valid: true,
      mediaGranted: true,
      renderMethod: 'grid',
      horizontal: true,
      loading: null,
      endCursor: '',
      hasNextPage: true,
    };

    this.beginWriting = this.beginWriting.bind(this);
    this.doneWriting = this.doneWriting.bind(this);
    this.renderSubcategorySelector = this.renderSubcategorySelector.bind(this);
    this.renderGridItem = this.renderGridItem.bind(this);
    this.renderBarItem = this.renderBarItem.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.updateWordsLeft = this.updateWordsLeft.bind(this);
    this.changeText = this.changeText.bind(this);
    this.onKeyboardOpen = this.onKeyboardOpen.bind(this);
    this.onKeyboardClose = this.onKeyboardClose.bind(this);
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

  async componentDidMount(): Promise<void> {
    setProfileOverride({
      enabled: true,
      text: 'Next',
      action: this.beginWriting,
    });
    const { composing } = this.props;
    if (
      composing.type === MailTypes.Postcard &&
      composing.design.image.uri.length
    ) {
      if (composing.design.subcategoryName) {
        this.setState({
          subcategory: composing.design.subcategoryName,
        });
      }
      this.changeDesign(composing.design);
      if (composing.content.length) {
        this.setState({ design: composing.design }, () => {
          this.beginWriting();
        });
      }
    } else {
      this.changeDesign(this.state.design);
    }
  }

  componentWillUnmount(): void {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
    this.unsubscribeKeyboardOpen.remove();
    this.unsubscribeKeyboardClose.remove();
  }

  onNavigationFocus = async (): Promise<void> => {
    const { content } = this.props.composing;

    if (this.editableRef.current) {
      if (!this.props.hasSentMail && !content) {
        this.editableRef.current.set(
          `${i18n.t('Compose.firstLetterGhostTextSalutation')} ${
            this.props.recipient.firstName
          }, ${i18n.t('Compose.firstLetterGhostTextBody')}`
        );
      } else {
        this.editableRef.current.set(content);
      }
    }

    if (!this.state.writing) {
      setProfileOverride({
        enabled: true,
        text: 'Next',
        action: this.beginWriting,
      });
    } else {
      setBackOverride({
        action: () => {
          this.backWriting();
        },
      });
      setProfileOverride({
        enabled: this.state.valid,
        text: i18n.t('Compose.done'),
        action: this.doneWriting,
      });
    }

    if (this.props.route.params.category.name === 'personal') {
      this.setState({ renderMethod: 'grid' });
      let finalStatus = (await MediaLibrary.getPermissionsAsync()).status;
      if (finalStatus !== 'granted') {
        finalStatus = (await MediaLibrary.requestPermissionsAsync()).status;
      }
      this.setState({ mediaGranted: finalStatus === 'granted' });
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
        this.setState({ subcategory: 'Library', hasNextPage, endCursor });
        this.props.navigation.setParams({
          category: {
            ...this.props.route.params.category,
            subcategories: {
              Library: library,
              'Take Photo': [],
            },
          },
        });
      }
    } else {
      this.setState({
        renderMethod: 'bars',
        subcategory: Object.keys(
          this.props.route.params.category.subcategories
        )[0],
      });
    }
  };

  onNavigationBlur = (): void => {
    setBackOverride(undefined);
    setProfileOverride(undefined);
  };

  onKeyboardOpen(): void {
    Animated.timing(this.state.keyboardOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  onKeyboardClose(): void {
    Animated.timing(this.state.keyboardOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  setValid(val: boolean): void {
    if (val !== this.state.valid) {
      this.setState({ valid: val });
      if (this.state.writing) {
        setProfileOverride({
          enabled: val,
          text: i18n.t('Compose.done'),
          action: this.doneWriting,
        });
      }
    }
  }

  designIsHorizontal = (): boolean => {
    const designWidth = this.state.design.image.width;
    const designHeight = this.state.design.image.height;
    if (!designWidth || !designHeight) {
      return true;
    }
    if (designWidth > designHeight) {
      return true;
    }
    return false;
  };

  updateWordsLeft(value: string): void {
    const numWords = getNumWords(value);
    this.setState({ wordsLeft: 100 - numWords });
    this.setValid(100 - numWords >= 0);
  }

  changeText(value: string): void {
    this.updateWordsLeft(value);
    this.props.setContent(value);
    saveDraft(this.props.composing);
  }

  changeDesign(design: PostcardDesign): void {
    if (design === this.state.design) return;
    saveDraft(this.props.composing);
    this.props.setDesign(design);
    this.setState({ design, loading: design });
    if (
      design.image.width &&
      design.image.height &&
      design.image.width > design.image.height
    ) {
      this.setState({ horizontal: true });
    } else {
      this.setState({ horizontal: false });
    }
    Segment.trackWithProperties('Compose - Add Image Success', {
      Option: 'Postcard',
      orientation: this.state.horizontal ? 'horizontal' : 'vertical',
    });
  }

  async loadMoreImages(): Promise<void> {
    if (this.props.route.params.category.name !== 'personal') return;
    if (!this.state.hasNextPage) return;
    const {
      assets,
      hasNextPage,
      endCursor,
    } = await MediaLibrary.getAssetsAsync({
      after: this.state.endCursor,
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    });
    const library = this.props.route.params.category.subcategories.Library;
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
    this.props.navigation.setParams({
      category: {
        ...this.props.route.params.category,
        subcategories: {
          Library: newLibrary,
          'Take Photo': [],
        },
      },
    });
    this.setState({
      hasNextPage,
      endCursor,
    });
  }

  beginWriting(): void {
    this.setState({ horizontal: true });
    Segment.trackWithProperties('Compose - Click on Next', {
      type: 'postcard',
      category: this.props.route.params.category.name,
      subcategory: this.state.design.subcategoryName,
      step: 'image',
    });
    if (!this.state.design.image.uri.length) {
      popupAlert({
        title: i18n.t('Alert.noDesignSelected'),
        message: i18n.t('Alert.selectADesign'),
        buttons: [{ text: i18n.t('Alert.okay') }],
      });
      return;
    }
    setProfileOverride({
      enabled: true,
      text: i18n.t('Compose.done'),
      action: this.doneWriting,
    });
    Animated.timing(this.state.flip, {
      useNativeDriver: false,
      toValue: 1,
      duration: FLIP_DURATION,
    }).start(() => {
      if (this.editableRef.current) this.editableRef.current.focus();
      this.setState({ writing: true });
      setBackOverride({
        action: () => {
          this.backWriting();
        },
      });
    });
  }

  backWriting(): void {
    Keyboard.dismiss();
    setBackOverride(undefined);
    this.changeDesign(this.state.design);
    this.setState({ horizontal: this.designIsHorizontal() });
    Segment.trackWithProperties('Compose - Click on Back', {
      Option: 'Postcard',
      Step: 'Caption',
    });
    Animated.timing(this.state.flip, {
      useNativeDriver: false,
      toValue: 0,
      duration: FLIP_DURATION,
    }).start(() => {
      this.setState({ writing: false });
      setProfileOverride({
        enabled: true,
        text: i18n.t('Compose.next'),
        action: () => {
          this.beginWriting();
        },
      });
    });
  }

  doneWriting(): void {
    if (!this.props.composing.content.length) {
      Segment.trackWithProperties('Compose - Click on Next Failure', {
        type: 'postcard',
        Error: 'Letter must have content',
      });
      dropdownError({ message: i18n.t('Compose.letterMustHaveContent') });
      return;
    }
    Segment.trackWithProperties('Compose - Click on Next', {
      type: 'postcard',
      category: this.props.route.params.category.name,
      subcategory: this.state.design.subcategoryName,
      step: 'draft',
    });
    this.props.navigation.navigate(Screens.ReviewPostcard, {
      category: this.props.route.params.category.name,
    });
  }

  renderSubcategorySelector(): JSX.Element {
    const subcategories = Object.keys(
      this.props.route.params.category.subcategories
    );
    return (
      <View style={Styles.subcategorySelectorBackground}>
        {subcategories.map((subcategory) => (
          <TouchableOpacity
            style={[
              Styles.subcategory,
              {
                borderBottomColor:
                  subcategory === this.state.subcategory ? 'white' : '#505050',
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
                    this.changeDesign({
                      image,
                      custom: true,
                      name: 'Personal Photo',
                      subcategoryName: 'Selfie',
                    });
                  }
                } catch (err) {
                  dropdownError({ message: i18n.t('Permission.camera') });
                }
              } else {
                this.setState({ subcategory });
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
                    this.state.subcategory === subcategory
                      ? 'white'
                      : Colors.GRAY_MEDIUM,
                },
              ]}
            >
              {capitalize(subcategory)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  renderGridItem(design: PostcardDesign): JSX.Element {
    return (
      <TouchableOpacity
        style={{
          width: (WINDOW_WIDTH - 32) / 3,
          height: (WINDOW_WIDTH - 32) / 3,
          margin: 4,
        }}
        onPress={() => this.changeDesign(design)}
      >
        <AsyncImage
          source={design.thumbnail ? design.thumbnail : design.image}
          imageStyle={{ flex: 1, aspectRatio: 1 }}
        />
      </TouchableOpacity>
    );
  }

  renderBarItem(design: PostcardDesign): JSX.Element {
    const width = WINDOW_WIDTH - 24;
    const height = width / 2.5;
    return (
      <TouchableOpacity
        style={{
          width,
          height,
          margin: 8,
          borderRadius: 6,
          overflow: 'hidden',
        }}
        onPress={() => this.changeDesign(design)}
      >
        <AsyncImage
          source={design.thumbnail ? design.thumbnail : design.image}
          imageStyle={{
            flex: 1,
            aspectRatio: width / height,
            overflow: 'hidden',
          }}
        />
        {this.state.loading === design && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          >
            <ImageComponent
              style={{ width: 40, height: 40 }}
              source={Loading}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  renderItem(design: PostcardDesign): JSX.Element {
    if (this.state.renderMethod === 'grid') {
      return this.renderGridItem(design);
    }
    if (this.state.renderMethod === 'bars') {
      return this.renderBarItem(design);
    }
    return <View />;
  }

  render(): JSX.Element {
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
      <TouchableOpacity
        activeOpacity={1.0}
        style={Styles.gridTrueBackground}
        onPress={Keyboard.dismiss}
      >
        <KeyboardAvoider>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View
              pointerEvents="box-none"
              style={[
                {
                  flex: 1,
                  paddingBottom: 40,
                  alignItems: 'center',
                },
              ]}
            >
              <Animated.View
                style={[
                  Styles.gridPreviewBackground,
                  {
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: POSTCARD_HEIGHT + 16,
                  },
                ]}
                pointerEvents={this.state.writing ? undefined : 'none'}
              >
                <EditablePostcard
                  ref={this.editableRef}
                  recipient={this.props.recipient}
                  design={this.state.design}
                  flip={this.state.flip}
                  onChangeText={this.changeText}
                  horizontal={this.state.horizontal}
                  onLoad={() => {
                    this.setState({ loading: null });
                  }}
                  active
                  width={POSTCARD_WIDTH}
                  height={POSTCARD_HEIGHT}
                />
              </Animated.View>
            </View>
          </ScrollView>
          <Animated.View
            style={[
              Styles.gridOptionsBackground,
              {
                position: 'absolute',
                bottom: 0,
                height: this.state.flip.interpolate({
                  inputRange: [0, 1],
                  outputRange: [BOTTOM_HEIGHT, 0],
                }),
              },
            ]}
          >
            {this.renderSubcategorySelector()}
            {this.state.mediaGranted && (
              <FlatList
                data={
                  this.props.route.params.category.subcategories[
                    this.state.subcategory
                  ]
                }
                renderItem={({ item }) => this.renderItem(item)}
                keyExtractor={(item: PostcardDesign, index: number) => {
                  return item.image.uri + index.toString();
                }}
                numColumns={this.state.renderMethod === 'grid' ? 3 : undefined}
                contentContainerStyle={Styles.gridBackground}
                key={this.state.renderMethod}
                onEndReached={this.loadMoreImages}
                ListEmptyComponent={emptyLoading}
              />
            )}
            {this.props.route.params.category.name === 'personal' &&
              !this.state.mediaGranted && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={[
                      Typography.FONT_REGULAR,
                      {
                        fontSize: 18,
                        paddingHorizontal: 10,
                        color: 'white',
                        textAlign: 'center',
                      },
                    ]}
                  >
                    {i18n.t('Permission.photos')}
                  </Text>
                </View>
              )}
          </Animated.View>
          <ComposeTools
            keyboardOpacity={this.state.keyboardOpacity}
            numLeft={this.state.wordsLeft}
          />
        </KeyboardAvoider>
      </TouchableOpacity>
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

const mapDispatchToProps = (dispatch: Dispatch<MailActionTypes>) => ({
  setContent: (content: string) => dispatch(setContent(content)),
  setDesign: (design: PostcardDesign) => dispatch(setDesign(design)),
});

const ComposePostcardScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComposePostcardScreenBase);

export default ComposePostcardScreen;

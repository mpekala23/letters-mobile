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
  Draft,
  Image,
  Category,
  Contact,
  MailTypes,
  DraftPostcard,
  PremadePostcardDesign,
  PostcardDesign,
} from 'types';
import { Typography, Colors } from '@styles';
import { WINDOW_WIDTH, capitalize, getNumWords, getImageDims } from '@utils';
import { setBackOverride, setProfileOverride } from '@components/Topbar';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import i18n from '@i18n';
import { AppState } from '@store/types';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { setContent, setDesign } from '@store/Mail/MailActions';
import { connect } from 'react-redux';
import { saveDraft } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { popupAlert } from '@components/Alert/Alert.react';
import AsyncImage from '@components/AsyncImage/AsyncImage.react';
import * as Segment from 'expo-analytics-segment';
import Loading from '@assets/common/loading.gif';
import { POSTCARD_WIDTH, POSTCARD_HEIGHT } from '@utils/Constants';
import { setDesignImage } from '@store/Category/CategoryActions';
import { CategoryActionTypes } from '@store/Category/CategoryTypes';
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
  setDesign: (design: PremadePostcardDesign) => void;
  updateDesignImage: (
    categoryId: number,
    subcategoryName: string,
    designId: number,
    image: Image
  ) => void;
}

interface State {
  subcategory: string;
  design: PremadePostcardDesign;
  loading: PremadePostcardDesign | null;
  writing: boolean;
  flip: Animated.Value;
  keyboardOpacity: Animated.Value;
  wordsLeft: number;
  valid: boolean;
  renderMethod: 'grid' | 'bars';
  horizontal: boolean;
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
        asset: { uri: '' },
        thumbnail: { uri: '' },
        name: '',
        type: 'premade_postcard',
      },
      writing: false,
      flip: new Animated.Value(0),
      keyboardOpacity: new Animated.Value(0),
      wordsLeft: (this.props.composing as DraftPostcard).size.wordsLimit,
      valid: true,
      renderMethod: 'grid',
      horizontal: true,
      loading: null,
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
      composing.design.type === 'premade_postcard' &&
      composing.design.asset.uri.length
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

    const { category } = this.props.route.params;
    const subcategories = Object.keys(category.subcategories);
    subcategories.forEach((subcategory) => {
      const designs = category.subcategories[subcategory];
      designs.forEach((design) => {
        if (design.asset.width && design.asset.height) return;
        getImageDims(design.asset.uri).then((dims) => {
          if (design.categoryId && design.id) {
            this.props.updateDesignImage(
              design.categoryId,
              subcategory,
              design.id,
              { ...design.asset, ...dims }
            );
          }
        });
      });
    });

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

    this.setState({
      renderMethod: 'grid',
      subcategory: Object.keys(
        this.props.route.params.category.subcategories
      )[0],
    });
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
    const designWidth = this.state.design.asset.width;
    const designHeight = this.state.design.asset.height;
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
    this.setState({
      wordsLeft:
        (this.props.composing as DraftPostcard).size.wordsLimit - numWords,
    });
    this.setValid(
      (this.props.composing as DraftPostcard).size.wordsLimit - numWords >= 0
    );
  }

  changeText(value: string): void {
    this.updateWordsLeft(value);
    this.props.setContent(value);
    saveDraft(this.props.composing);
  }

  changeDesign(design: PremadePostcardDesign): void {
    if (design === this.state.design) return;
    saveDraft(this.props.composing);
    this.props.setDesign(design);
    this.setState({ design, loading: design });
    if (
      design.asset.width &&
      design.asset.height &&
      design.asset.width < design.asset.height
    ) {
      this.setState({ horizontal: false });
    } else {
      this.setState({ horizontal: true });
    }
    Segment.trackWithProperties('Compose - Add Image Success', {
      Option: 'Postcard',
      orientation: this.state.horizontal ? 'horizontal' : 'vertical',
    });
  }

  beginWriting(): void {
    this.setState({ horizontal: true });
    Segment.trackWithProperties('Compose - Click on Next', {
      type: 'postcard',
      category: this.props.route.params.category.name,
      subcategory: this.state.design.subcategoryName,
      contentResearcher: this.state.design.contentResearcher,
      designer: this.state.design.designer,
      step: 'image',
    });
    if (!this.state.design.asset.uri.length) {
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
      contentResearcher: this.state.design.contentResearcher,
      designer: this.state.design.designer,
      step: 'draft',
    });
    this.props.navigation.navigate(Screens.ReviewPostcard, {
      category: this.props.route.params.category.name,
    });
  }

  narrowData(): PremadePostcardDesign[] {
    const data = this.props.route.params.category.subcategories[
      this.state.subcategory
    ];
    return data && data.length && data[0].type === 'premade_postcard'
      ? (data as PremadePostcardDesign[])
      : [];
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
              this.setState({ subcategory });
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
                      : Colors.GRAY_300,
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

  renderGridItem(design: PremadePostcardDesign): JSX.Element {
    return (
      <TouchableOpacity
        style={{
          width: (WINDOW_WIDTH - 32) / 2,
          height: (WINDOW_WIDTH - 32) / 2,
          margin: 4,
        }}
        onPress={() => {
          this.changeDesign(design);
        }}
      >
        <AsyncImage
          source={design.thumbnail}
          imageStyle={{ flex: 1, aspectRatio: 1 }}
        />
      </TouchableOpacity>
    );
  }

  renderBarItem(design: PremadePostcardDesign): JSX.Element {
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
        onPress={() => {
          this.changeDesign(design);
        }}
      >
        <AsyncImage
          source={design.thumbnail}
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

  renderItem(design: PremadePostcardDesign): JSX.Element {
    if (this.state.renderMethod === 'grid') {
      return this.renderGridItem(design);
    }
    if (this.state.renderMethod === 'bars') {
      return this.renderBarItem(design);
    }
    return <View />;
  }

  render(): JSX.Element {
    const data = this.narrowData();
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={Styles.gridTrueBackground}
        onPress={Keyboard.dismiss}
      >
        <KeyboardAvoider>
          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
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

              <FlatList
                data={data}
                renderItem={({ item }) => this.renderItem(item)}
                keyExtractor={(item: PremadePostcardDesign, index: number) => {
                  return item.image.uri + index.toString();
                }}
                numColumns={this.state.renderMethod === 'grid' ? 2 : undefined}
                contentContainerStyle={Styles.gridBackground}
                key={this.state.renderMethod}
                // onEndReached={this.loadMoreImages}
                // ListEmptyComponent={emptyLoading}
              />
            </Animated.View>
            <ComposeTools
              keyboardOpacity={this.state.keyboardOpacity}
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
  hasSentMail: Object.values(state.mail.existing).some(
    (mail) => mail.length > 0
  ),
  recipient: state.contact.active,
});

const mapDispatchToProps = (
  dispatch: Dispatch<MailActionTypes | CategoryActionTypes>
) => ({
  setContent: (content: string) => dispatch(setContent(content)),
  setDesign: (design: PremadePostcardDesign) => dispatch(setDesign(design)),
  updateDesignImage: (
    categoryId: number,
    subcategoryName: string,
    designId: number,
    image: Image
  ) => dispatch(setDesignImage(categoryId, subcategoryName, designId, image)),
});

const ComposePostcardScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComposePostcardScreenBase);

export default ComposePostcardScreen;

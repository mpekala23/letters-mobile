import React, { createRef, Dispatch } from 'react';
import {
  Text,
  View,
  Image as ImageComponent,
  FlatList,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Keyboard,
  EmitterSubscription,
  Platform,
} from 'react-native';
import { EditablePostcard, ComposeTools } from '@components';
import { PostcardDesign, Draft, Image, Category } from 'types';
import { Typography } from '@styles';
import { WINDOW_WIDTH, WINDOW_HEIGHT, takeImage } from '@utils';
import {
  setBackOverride,
  setProfileOverride,
} from '@components/Topbar/Topbar.react';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import i18n from '@i18n';
import { AppState } from '@store/types';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { setContent, setDesign } from '@store/Mail/MailActions';
import { connect } from 'react-redux';
import { saveDraft, getCategories } from '@api';
import { Contact } from '@store/Contact/ContactTypes';
import * as MediaLibrary from 'expo-media-library';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { popupAlert } from '@components/Alert/Alert.react';
import Styles from './Compose.styles';

const FLIP_DURATION = 500;

type ComposePostcardScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ComposePostcard'
>;

export interface Props {
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
  data: Record<string, PostcardDesign[]>;
  subcategory: string;
  design: PostcardDesign;
  writing: boolean;
  flip: Animated.Value;
  keyboardOpacity: Animated.Value;
  charsLeft: number;
  valid: boolean;
  mediaGranted: boolean;
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
      data: {},
      subcategory: props.initialSubcategory,
      design: {
        image: { uri: '' },
      },
      writing: false,
      flip: new Animated.Value(0),
      keyboardOpacity: new Animated.Value(0),
      charsLeft: 300,
      valid: true,
      mediaGranted: true,
    };

    this.beginWriting = this.beginWriting.bind(this);
    this.doneWriting = this.doneWriting.bind(this);
    this.renderSubcategorySelector = this.renderSubcategorySelector.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.updateCharsLeft = this.updateCharsLeft.bind(this);
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
    this.changeDesign(this.state.design);
    const response = await getCategories();
  }

  componentWillUnmount(): void {
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
      let finalStatus = (await MediaLibrary.getPermissionsAsync()).status;
      if (finalStatus !== 'granted') {
        finalStatus = (await MediaLibrary.requestPermissionsAsync()).status;
      }
      this.setState({ mediaGranted: finalStatus === 'granted' });
      if (finalStatus === 'granted') {
        await this.loadData();
      }
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
    this.setState({ valid: val });
    if (this.state.writing) {
      setProfileOverride({
        enabled: val,
        text: i18n.t('Compose.done'),
        action: this.doneWriting,
      });
    }
  }

  async loadData(): Promise<void> {
    if (this.props.route.params.category.name === 'personal') {
      const assets = await MediaLibrary.getAssetsAsync();
      const library = assets.assets.map((value) => {
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
      const data = {
        Library: library,
        'Take Photo': [],
      };
      this.setState({ data, subcategory: 'Library' });
    }
  }

  updateCharsLeft(value: string): void {
    this.setState({ charsLeft: 300 - value.length });
    this.setValid(300 - value.length >= 0);
  }

  changeText(value: string): void {
    this.updateCharsLeft(value);
    this.props.setContent(value);
    saveDraft(this.props.composing);
  }

  changeDesign(design: PostcardDesign): void {
    this.props.setDesign(design);
    this.setState({ design });
  }

  beginWriting(): void {
    if (this.state.design.image.uri === '') {
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
    this.props.navigation.navigate('ReviewPostcard');
  }

  renderSubcategorySelector(): JSX.Element {
    const subcategories = Object.keys(this.state.data);
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
              if (subcategory === 'Take Photo') {
                try {
                  const image = await takeImage({
                    aspect: [6, 4],
                    allowsEditing: true,
                  });
                  if (image) {
                    this.changeDesign({ image, custom: true });
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
            <Text style={[Typography.FONT_MEDIUM, Styles.subcategoryText]}>
              {subcategory}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  renderItem(design: PostcardDesign): JSX.Element {
    return (
      <TouchableOpacity
        style={{
          width: (WINDOW_WIDTH - 32) / 3,
          height: (WINDOW_WIDTH - 32) / 3,
          margin: 4,
        }}
        onPress={() => this.changeDesign(design)}
      >
        <ImageComponent
          style={{ flex: 1, aspectRatio: 1, overflow: 'hidden' }}
          source={design.image}
        />
      </TouchableOpacity>
    );
  }

  render(): JSX.Element {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={Styles.gridTrueBackground}
        onPress={Keyboard.dismiss}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : -200}
          enabled
        >
          <Animated.View
            style={[
              Styles.gridPreviewBackground,
              {
                transform: [
                  {
                    scale: this.state.keyboardOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.25],
                    }),
                  },
                ],
                left: this.state.keyboardOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, (WINDOW_WIDTH - 24) / 8],
                }),
                top: this.state.keyboardOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, (((WINDOW_HEIGHT - 80) * 2) / 5 - 24) / 8],
                }),
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
              active
            />
          </Animated.View>
          <Animated.View
            style={[
              Styles.gridOptionsBackground,
              {
                top: this.state.flip.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          >
            {this.renderSubcategorySelector()}
            {this.state.mediaGranted && (
              <FlatList
                data={this.state.data[this.state.subcategory]}
                renderItem={({ item }) => this.renderItem(item)}
                keyExtractor={(item: PostcardDesign, index: number) => {
                  return item.image.uri + index.toString();
                }}
                numColumns={3}
                contentContainerStyle={Styles.gridBackground}
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
          <View style={{ position: 'absolute', bottom: -8 }}>
            <ComposeTools
              keyboardOpacity={this.state.keyboardOpacity}
              numLeft={this.state.charsLeft}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  composing: state.mail.composing,
  hasSentLetters: Object.values(state.mail.existing).some(
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

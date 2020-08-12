import React, { createRef } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  EmitterSubscription,
  Platform,
} from 'react-native';
import { EditablePostcard, ComposeTools } from '@components';
import { PostcardDesign } from 'types';
import { Typography } from '@styles';
import { WINDOW_WIDTH } from '@utils';
import {
  setBackOverride,
  setProfileOverride,
} from '@components/Topbar/Topbar.react';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import i18n from '@i18n';
import Styles from './Compose.styles';

const EXAMPLE_DATA: Record<string, PostcardDesign[]> = {
  'Prison Art': [
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
  ],
  Scenery: [
    {
      image: {
        uri:
          'https://s3.amazonaws.com/thumbnails.thecrimson.com/photos/2018/07/07/110709_1331528.jpg.1500x1000_q95_crop-smart_upscale.jpg',
      },
    },
  ],
};

const FLIP_DURATION = 600;

type GridComposeScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'GridCompose'
>;

export interface Props {
  navigation: GridComposeScreenNavigationProp;
  data: Record<string, PostcardDesign[]>;
  initialSubcategory: string;
}

interface State {
  subcategory: string;
  design: PostcardDesign;
  writing: boolean;
  flip: Animated.Value;
  keyboardOpacity: Animated.Value;
  charsLeft: number;
  open: boolean;
  valid: boolean;
}

export default class GridCompose extends React.Component<Props, State> {
  static defaultProps = {
    data: EXAMPLE_DATA,
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
      design: props.data[props.initialSubcategory][0],
      writing: false,
      flip: new Animated.Value(0),
      keyboardOpacity: new Animated.Value(0),
      charsLeft: 300,
      open: false,
      valid: true,
    };

    this.beginWriting = this.beginWriting.bind(this);
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

  componentDidMount(): void {
    setProfileOverride({
      enabled: true,
      text: 'Next',
      action: this.beginWriting,
    });
  }

  componentWillUnmount(): void {
    this.unsubscribeKeyboardOpen.remove();
    this.unsubscribeKeyboardClose.remove();
  }

  onNavigationFocus = (): void => {
    setProfileOverride({
      enabled: true,
      text: 'Next',
      action: this.beginWriting,
    });
  };

  onNavigationBlur = (): void => {
    setBackOverride(undefined);
    setProfileOverride(undefined);
  };

  onKeyboardOpen(): void {
    Animated.timing(this.state.keyboardOpacity, {
      toValue: 1,
      duration: Platform.OS === 'ios' ? 220 : 220,
      useNativeDriver: false,
    }).start();
    this.setState({ open: true });
  }

  onKeyboardClose(): void {
    Animated.timing(this.state.keyboardOpacity, {
      toValue: 0,
      duration: Platform.OS === 'ios' ? 220 : 220,
      useNativeDriver: false,
    }).start();
    this.setState({ open: false });
  }

  setValid(val: boolean): void {
    this.setState({ valid: val });
    if (this.state.writing) {
      setProfileOverride({
        enabled: val,
        text: i18n.t('Compose.next'),
        action: () => console.log('final next pressed'),
      });
    }
  }

  updateCharsLeft(value: string): void {
    this.setState({ charsLeft: 300 - value.length });
    this.setValid(300 - value.length >= 0);
  }

  changeText(value: string): void {
    this.updateCharsLeft(value);
    // this.props.setContent(value);
    // saveDraft(this.props.composing);
  }

  beginWriting(): void {
    setProfileOverride({
      enabled: true,
      text: 'Done',
      action: () => console.log('done'),
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
        text: 'Next',
        action: () => {
          this.beginWriting();
        },
      });
    });
  }

  renderSubcategorySelector(): JSX.Element {
    const subcategories = Object.keys(this.props.data);
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
            onPress={() => this.setState({ subcategory })}
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
        style={{ width: (WINDOW_WIDTH - 32) / 3, margin: 4 }}
        onPress={() => this.setState({ design })}
      >
        <Image
          style={{ aspectRatio: 1, overflow: 'hidden' }}
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
        <View
          style={Styles.gridPreviewBackground}
          pointerEvents={this.state.writing ? undefined : 'none'}
        >
          <EditablePostcard
            ref={this.editableRef}
            design={this.state.design}
            flip={this.state.flip}
            onChangeText={this.changeText}
          />
        </View>
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
          <FlatList
            data={EXAMPLE_DATA[this.state.subcategory]}
            renderItem={({ item }) => this.renderItem(item)}
            keyExtractor={(item: PostcardDesign, index: number) => {
              return item.image.uri + index.toString();
            }}
            numColumns={3}
            contentContainerStyle={Styles.gridBackground}
          />
        </Animated.View>
        <ComposeTools
          keyboardOpacity={this.state.keyboardOpacity}
          numLeft={this.state.charsLeft}
        />
      </TouchableOpacity>
    );
  }
}

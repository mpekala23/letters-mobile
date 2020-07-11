import React, { Dispatch, createRef } from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import { ComposeHeader, Input, Button } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import {
  setPhotoPath,
  setDraft,
  setContent,
} from '@store/Letter/LetterActions';
import { LetterActionTypes } from '@store/Letter/LetterTypes';
import i18n from '@i18n';
import { WINDOW_WIDTH } from '@utils';
import { Colors, Typography } from '@styles';
import { Letter } from 'types';
import PicUpload, {
  PicUploadTypes,
} from '@components/PicUpload/PicUpload.react';
import Styles from './Compose.styles';

type ComposeLetterScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ComposePostcard'
>;

interface Props {
  navigation: ComposeLetterScreenNavigationProp;
  composing: Letter;
  recipientName: string;
  setContent: (content: string) => void;
  setPhotoPath: (path: string) => void;
  setDraft: (value: boolean) => void;
}

interface State {
  keyboardOpacity: Animated.Value;
  charsLeft: number;
}

class ComposePostcardScreenBase extends React.Component<Props, State> {
  private picRef = createRef<PicUpload>();

  private unsubscribeFocus: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      keyboardOpacity: new Animated.Value(0),
      charsLeft: 300,
    };
    this.updateCharsLeft = this.updateCharsLeft.bind(this);
    this.changeText = this.changeText.bind(this);
    this.registerPhoto = this.registerPhoto.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
  }

  onNavigationFocus() {
    this.props.setDraft(true);
  }

  updateCharsLeft(value: string): void {
    this.setState({ charsLeft: 300 - value.length });
  }

  changeText(value: string): void {
    this.updateCharsLeft(value);
    this.props.setContent(value);
  }

  registerPhoto(photo: string): void {
    this.props.setPhotoPath(photo);
  }

  deletePhoto(): void {
    this.props.setPhotoPath('');
  }

  render(): JSX.Element {
    return (
      <TouchableOpacity
        accessible={false}
        style={{ flex: 1, backgroundColor: 'white' }}
        onPress={Keyboard.dismiss}
        activeOpacity={1.0}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled
          keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 100}
          pointerEvents="box-none"
        >
          <View
            style={[
              Styles.screenBackground,
              {
                flex: 1,
                paddingBottom: 50,
              },
            ]}
          >
            <Button
              buttonText="Next Page"
              onPress={() => {
                // TODO: Once [Mobile Component Librar] Bars is done,
                // replace this with a press of the next button in the navbar
                this.props.navigation.navigate('PostcardPreview');
              }}
            />
            <ComposeHeader recipientName={this.props.recipientName} />
            <Input
              parentStyle={{ flex: 1 }}
              inputStyle={{
                fontSize: 18,
                flex: 1,
              }}
              onChangeText={this.changeText}
              onFocus={() => {
                Animated.timing(this.state.keyboardOpacity, {
                  toValue: 1,
                  duration: 100,
                  useNativeDriver: false,
                }).start();
              }}
              onBlur={() => {
                Animated.timing(this.state.keyboardOpacity, {
                  toValue: 0,
                  duration: 100,
                  useNativeDriver: false,
                }).start();
              }}
              placeholder={i18n.t('Compose.placeholder')}
              numLines={100}
            >
              <Animated.View
                style={[
                  {
                    opacity: this.state.keyboardOpacity.interpolate({
                      inputRange: [0, 0.1, 1],
                      outputRange: [1, 0.5, 0],
                    }),
                    height: this.state.keyboardOpacity.interpolate({
                      inputRange: [0, 0.8, 1],
                      outputRange: [200, 200, 0],
                    }),
                  },
                ]}
              >
                <PicUpload
                  ref={this.picRef}
                  onSuccess={this.registerPhoto}
                  onDelete={this.deletePhoto}
                  type={PicUploadTypes.Media}
                  width={180}
                  height={200}
                />
              </Animated.View>
            </Input>
            <Animated.View
              style={{
                opacity: this.state.keyboardOpacity,
                position: 'absolute',
                bottom: 0,
                width: WINDOW_WIDTH,
              }}
            >
              <TouchableOpacity
                activeOpacity={1.0}
                style={Styles.keyboardButtonContainer}
              >
                <View style={[Styles.keyboardButtonItem, { flex: 1 }]}>
                  <Text
                    style={[
                      Typography.FONT_REGULAR,
                      { color: Colors.GRAY_DARK },
                    ]}
                  >
                    {this.state.charsLeft} left
                  </Text>
                </View>
                <TouchableOpacity
                  style={[Styles.keyboardButtonItem, { flex: 1 }]}
                  onPress={async () => {
                    Keyboard.dismiss();
                    if (this.picRef.current) {
                      await this.picRef.current.selectImage();
                    }
                  }}
                >
                  <Text>pic</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[Styles.keyboardButtonItem, { flex: 1 }]}
                  onPress={Keyboard.dismiss}
                >
                  <Text
                    style={[
                      Typography.FONT_REGULAR,
                      {
                        color:
                          this.state.charsLeft >= 0
                            ? Colors.GRAY_DARK
                            : Colors.AMEELIO_RED,
                      },
                    ]}
                  >
                    done
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  composing: state.letter.composing,
  recipientName: state.contact.active.firstName,
});
const mapDispatchToProps = (dispatch: Dispatch<LetterActionTypes>) => {
  return {
    setContent: (content: string) => dispatch(setContent(content)),
    setPhotoPath: (path: string) => dispatch(setPhotoPath(path)),
    setDraft: (value: boolean) => dispatch(setDraft(value)),
  };
};
const ComposePostcardScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComposePostcardScreenBase);

export default ComposePostcardScreen;

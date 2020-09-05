import React, { createRef } from 'react';
import { View, Animated, Text } from 'react-native';
import { PostcardDesign, Contact } from 'types';
import Stamp from '@assets/views/Compose/Stamp';
import i18n from '@i18n';
import { Typography, Colors } from '@styles';
import Styles from './EditablePostcard.styles';
import Icon from '../Icon/Icon.react';
import Input from '../Input/Input.react';
import AsyncImage from '../AsyncImage/AsyncImage.react';

interface Props {
  design: PostcardDesign;
  flip?: Animated.Value;
  onChangeText: (text: string) => void;
  recipient: Contact;
  horizontal?: boolean;
  onLoad?: () => void;
}

interface State {
  rotate: Animated.Value;
  width: number;
  height: number;
}

class EditablePostcard extends React.Component<Props, State> {
  static defaultProps = {
    active: true,
    horizontal: true,
  };

  private inputRef = createRef<Input>();

  constructor(props: Props) {
    super(props);
    this.state = {
      rotate: new Animated.Value(0),
      width: 200,
      height: 200,
    };
    this.focus = this.focus.bind(this);
    this.set = this.set.bind(this);
  }

  componentDidMount(): void {
    Animated.timing(this.state.rotate, {
      toValue: this.props.horizontal ? 0 : 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.horizontal === this.props.horizontal) return;
    Animated.timing(this.state.rotate, {
      toValue: this.props.horizontal ? 0 : 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }

  focus(): void {
    if (this.inputRef.current) this.inputRef.current.forceFocus();
  }

  set(value: string): void {
    if (this.inputRef.current) this.inputRef.current.set(value);
  }

  render(): JSX.Element {
    const designWidth = this.props.design.image.width;
    const designHeight = this.props.design.image.height;
    const designIsHorizontal = (): boolean => {
      if (!designWidth || !designHeight) {
        return true;
      }
      if (designWidth > designHeight) {
        return true;
      }
      return false;
    };
    let image: JSX.Element;
    if (designIsHorizontal()) {
      image = (
        <AsyncImage
          viewStyle={{
            width: this.state.width,
            height: this.state.height,
          }}
          source={this.props.design.thumbnail || this.props.design.image}
          onLoad={this.props.onLoad}
          download={!!this.props.design.thumbnail}
        />
      );
    } else {
      image = (
        <AsyncImage
          viewStyle={{
            width: this.state.height,
            height: this.state.width,
            transform: [{ rotateZ: '270deg' }],
          }}
          source={this.props.design.thumbnail || this.props.design.image}
          onLoad={this.props.onLoad}
          download={!!this.props.design.thumbnail}
        />
      );
    }

    return (
      <Animated.View
        style={[
          Styles.background,
          {
            transform: this.props.flip
              ? [
                  {
                    scale: this.state.rotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.65],
                    }),
                  },
                  {
                    rotateZ: this.state.rotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 3.1415926 / 2],
                    }),
                  },
                  {
                    scaleX: this.props.flip.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, -1],
                    }),
                  },
                ]
              : undefined,
          },
        ]}
        onLayout={(e: {
          nativeEvent: { layout: { width: number; height: number } };
        }) => {
          this.setState({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          });
        }}
      >
        <Animated.View
          style={{
            width: '100%',
            height: '100%',
            opacity: this.props.flip
              ? this.props.flip.interpolate({
                  inputRange: [0, 0.4999, 0.5, 1],
                  outputRange: [1, 1, 0, 0],
                })
              : 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {this.props.design.image.uri !== '' ? (
            image
          ) : (
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: Colors.BLACK_200,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={[Typography.FONT_REGULAR, { color: 'black' }]}>
                {i18n.t('Compose.noDesignSelected')}
              </Text>
            </View>
          )}
        </Animated.View>
        <Animated.View
          style={[
            {
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.05)',
              opacity: this.props.flip
                ? this.props.flip.interpolate({
                    inputRange: [0, 0.4999, 0.5, 1],
                    outputRange: [0, 0, 1, 1],
                  })
                : 0,
              transform: [{ scaleX: -1 }],
            },
            Styles.writingBackground,
          ]}
        >
          <View style={{ flex: 1, height: '105%' }}>
            <Input
              numLines={1000}
              parentStyle={{ flex: 1 }}
              inputStyle={{ flex: 1, fontSize: 14 }}
              placeholder={i18n.t('Compose.tapToAddMessage')}
              onChangeText={this.props.onChangeText}
              ref={this.inputRef}
            />
          </View>
          <View style={Styles.writingDivider} />
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Icon
              style={{ position: 'absolute', top: 10, right: 10 }}
              svg={Stamp}
            />
            <View>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                {this.props.recipient.firstName} {this.props.recipient.lastName}
                , {this.props.recipient.inmateNumber}
              </Text>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                {this.props.recipient.facility?.name}
              </Text>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                {this.props.recipient.facility?.address}
              </Text>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                {this.props.recipient.facility?.city},{' '}
                {this.props.recipient.facility?.state}{' '}
                {this.props.recipient.facility?.postal}
              </Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

export default EditablePostcard;

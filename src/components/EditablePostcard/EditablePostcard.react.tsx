import React, { createRef } from 'react';
import { View, Animated, Text } from 'react-native';
import { PostcardDesign, Contact } from 'types';
import Stamp from '@assets/views/Compose/Stamp';
import i18n from '@i18n';
import { Typography, Colors } from '@styles';
import { getPostcardDesignImage } from '@utils';
import MailingAddressPreview from '../MailingAddressPreview/MailingAddressPreview.react';
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
  width: number;
  height: number;
}

interface State {
  rotate: Animated.Value;
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
    const image = this.props.horizontal ? (
      <AsyncImage
        viewStyle={{
          width: this.props.width,
          height: this.props.height,
        }}
        source={getPostcardDesignImage(this.props.design)}
        onLoad={this.props.onLoad}
        download={this.props.design.type === 'premade_postcard'}
      />
    ) : (
      <AsyncImage
        viewStyle={{
          width: this.props.height,
          height: this.props.width,
          transform: [{ rotateZ: '270deg' }],
        }}
        source={getPostcardDesignImage(this.props.design)}
        onLoad={this.props.onLoad}
        download={this.props.design.type === 'premade_postcard'}
        autorotate={false}
      />
    );

    return (
      <Animated.View
        style={[
          Styles.background,
          {
            transform: this.props.flip
              ? [
                  {
                    rotateZ: this.state.rotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', `90deg`],
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
          {
            width: this.props.width,
            height: this.props.height,
          },
        ]}
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
          {this.props.design.asset.uri && this.props.design.asset.uri !== '' ? (
            image
          ) : (
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: Colors.GRAY_200,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ width: '60%' }}>
                <Text style={[Typography.FONT_REGULAR, { color: 'black' }]}>
                  {i18n.t('Compose.noDesignSelected')}
                </Text>
              </View>
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
            <MailingAddressPreview
              style={{ paddingHorizontal: 8, paddingTop: 24 }}
              recipient={this.props.recipient}
            />
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

export default EditablePostcard;

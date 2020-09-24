import React, { createRef } from 'react';
import { View, Animated, TouchableOpacity, PixelRatio } from 'react-native';
import { Contact, Image, Layout, Sticker, PlacedSticker } from 'types';
import Stamp from '@assets/views/Compose/Stamp';
import i18n from '@i18n';
import { Colors } from '@styles';
import AddImage from '@assets/components/DynamicPostcard/AddImage';
import { captureRef } from 'react-native-view-shot';
import MailingAddressPreview from '../MailingAddressPreview/MailingAddressPreview.react';
import Styles from './DynamicPostcard.styles';
import Icon from '../Icon/Icon.react';
import Input from '../Input/Input.react';
import AsyncImage from '../AsyncImage/AsyncImage.react';
import StickerManager from '../StickerManager/StickerManager.react';
import { STICKER_SIZE } from '../StickerManager/StickerComponent.styles';

const pixelRatio = PixelRatio.get();
const pixelWidth = 1800 / pixelRatio;
const pixelHeight = 1200 / pixelRatio;

interface Props {
  layout: Layout;
  commonLayout: Layout;
  flip?: Animated.Value;
  onChangeText: (text: string) => void;
  recipient: Contact;
  onLoad?: () => void;
  width: number;
  height: number;
  onImageAdd: (position: number) => void;
  activePosition: number;
  highlightActive: boolean;
  bottomDetails: 'layout' | 'design' | 'stickers' | null;
}

interface State {
  placedStickers: PlacedSticker[];
}

class DynamicPostcard extends React.Component<Props, State> {
  private inputRef = createRef<Input>();

  private viewShotRef = createRef<View>();

  private stickerManagerRef = createRef<StickerManager>();

  constructor(props: Props) {
    super(props);
    this.focus = this.focus.bind(this);
    this.set = this.set.bind(this);
    this.state = {
      placedStickers: [],
    };
  }

  async getSnapshot(): Promise<Image> {
    const result = await captureRef(this.viewShotRef, {
      format: 'png',
      width: pixelWidth,
      height: pixelHeight,
    });
    return {
      uri: result,
      width: pixelWidth,
      height: pixelHeight,
    };
  }

  set(value: string): void {
    if (this.inputRef.current) this.inputRef.current.set(value);
  }

  focus(): void {
    if (this.inputRef.current) this.inputRef.current.forceFocus();
  }

  addSticker(sticker: Sticker): void {
    if (this.stickerManagerRef.current) {
      this.stickerManagerRef.current.addSticker(sticker);
    }
  }

  renderImage(position: number, border = true): JSX.Element {
    const design = this.props.layout.designs[position];
    return (
      <TouchableOpacity
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F7F7F7',
          borderColor:
            position === this.props.activePosition && this.props.highlightActive
              ? Colors.BLUE_300
              : 'transparent',
          borderWidth: border ? 2 : 0,
          borderRadius: border ? 2 : 0,
        }}
        onPress={() => this.props.onImageAdd(position)}
      >
        {!design ? (
          <Icon svg={AddImage} />
        ) : (
          <AsyncImage
            viewStyle={{ width: '100%', height: '100%' }}
            source={design.image}
          />
        )}
      </TouchableOpacity>
    );
  }

  renderImages(): JSX.Element {
    const PADDING = 4;
    if (this.props.layout.id === 1) {
      return this.renderImage(1, false);
    }
    if (this.props.layout.id === 2) {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            flexDirection: 'row',
          }}
        >
          <View
            style={{ flex: 1, padding: PADDING, paddingRight: PADDING / 2 }}
          >
            {this.renderImage(1)}
          </View>
          <View style={{ flex: 1, padding: PADDING, paddingLeft: PADDING / 2 }}>
            {this.renderImage(2)}
          </View>
        </View>
      );
    }
    if (this.props.layout.id === 3) {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            flexDirection: 'row',
          }}
        >
          <View
            style={{ flex: 1, padding: PADDING, paddingRight: PADDING / 2 }}
          >
            {this.renderImage(1)}
          </View>
          <View
            style={{
              flex: 1,
              padding: PADDING,
              paddingLeft: PADDING / 2,
              flexDirection: 'column',
            }}
          >
            <View style={{ flex: 1, paddingBottom: PADDING / 2 }}>
              {this.renderImage(2)}
            </View>
            <View style={{ flex: 1, paddingTop: PADDING / 2 }}>
              {this.renderImage(3)}
            </View>
          </View>
        </View>
      );
    }
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            flex: 1,
            padding: PADDING,
            paddingRight: PADDING / 2,
            flexDirection: 'column',
          }}
        >
          <View style={{ flex: 1, paddingBottom: PADDING / 2 }}>
            {this.renderImage(1)}
          </View>
          <View style={{ flex: 1, paddingTop: PADDING / 2 }}>
            {this.renderImage(3)}
          </View>
        </View>
        <View
          style={{
            flex: 1,
            padding: PADDING,
            paddingLeft: PADDING / 2,
            flexDirection: 'column',
          }}
        >
          <View style={{ flex: 1, paddingBottom: PADDING / 2 }}>
            {this.renderImage(2)}
          </View>
          <View style={{ flex: 1, paddingTop: PADDING / 2 }}>
            {this.renderImage(4)}
          </View>
        </View>
      </View>
    );
  }

  render(): JSX.Element {
    return (
      <Animated.View
        style={[
          Styles.background,
          {
            width: this.props.width,
            height: this.props.height,
            transform: this.props.flip
              ? [
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
      >
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: this.props.flip
              ? this.props.flip.interpolate({
                  inputRange: [0, 0.9999999, 1],
                  outputRange: ['100%', '100%', '0%'],
                })
              : '100%',
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
          <View style={{ opacity: 0.0 }}>
            <View
              ref={this.viewShotRef}
              collapsable={false}
              style={{
                position: 'absolute',
                width: pixelWidth,
                height: pixelHeight,
              }}
            >
              {this.renderImages()}
              {this.state.placedStickers.map((placedSticker) => {
                const growBy = pixelWidth / this.props.width;
                return (
                  <View
                    style={{
                      position: 'absolute',
                      width: STICKER_SIZE * growBy,
                      height: STICKER_SIZE * growBy,
                      left:
                        placedSticker.position.x * growBy -
                        (STICKER_SIZE / 2) * growBy,
                      top:
                        placedSticker.position.y * growBy -
                        (STICKER_SIZE / 2) * growBy,
                      transform: [
                        { scale: placedSticker.scale },
                        { rotateZ: placedSticker.rotation.toString() },
                      ],
                    }}
                    key={placedSticker.id}
                  >
                    {placedSticker.sticker.component}
                  </View>
                );
              })}
            </View>
          </View>
          <View collapsable={false} style={{ width: '100%', height: '100%' }}>
            {this.renderImages()}
            <StickerManager
              ref={this.stickerManagerRef}
              active={this.props.bottomDetails === 'stickers'}
              updateStickers={(placedStickers) => {
                this.setState({ placedStickers });
              }}
              width={this.props.width}
              height={this.props.height}
            />
          </View>
        </Animated.View>
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: '100%',
              height: this.props.flip
                ? this.props.flip.interpolate({
                    inputRange: [0, 0.000001, 1],
                    outputRange: ['0%', '100%', '100%'],
                  })
                : 0,
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
              numLines={50}
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

export default DynamicPostcard;

import React, { createRef } from 'react';
import { View, Animated, TouchableOpacity, PixelRatio } from 'react-native';
import {
  Contact,
  Image,
  Layout,
  Sticker,
  PlacedSticker,
  ComposeBottomDetails,
} from 'types';
import Stamp from '@assets/views/Compose/Stamp';
import i18n from '@i18n';
import { Colors } from '@styles';
import AddImage from '@assets/components/DynamicPostcard/AddImage';
import { captureRef } from 'react-native-view-shot';
import * as Segment from 'expo-analytics-segment';
import MailingAddressPreview from '../MailingAddressPreview/MailingAddressPreview.react';
import Styles from './DynamicPostcard.styles';
import Icon from '../Icon/Icon.react';
import Input from '../Input/Input.react';
import AsyncImage from '../AsyncImage/AsyncImage.react';
import StickerManager from '../StickerManager/StickerManager.react';
import { STICKER_SIZE } from '../StickerManager/StickerComponent.styles';

const DESIRED_ACTUAL_PIXEL_WIDTH = 1800;
const DESIRED_ACTUAL_PIXEL_HEIGHT = 1200;

const pixelRatio = PixelRatio.get();
const pixelWidth = DESIRED_ACTUAL_PIXEL_WIDTH / pixelRatio;
const pixelHeight = DESIRED_ACTUAL_PIXEL_HEIGHT / pixelRatio;

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
  bottomDetails: ComposeBottomDetails | null;
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
    Segment.trackWithProperties('Compose - Start Writing', {
      layout: this.props.layout.id,
      stickers: this.state.placedStickers.map(
        (placedSticker) => placedSticker.sticker.name
      ),
    });
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
        style={[
          Styles.imageBackground,
          {
            borderColor:
              position === this.props.activePosition &&
              this.props.highlightActive
                ? Colors.BLUE_300
                : 'transparent',
            borderWidth: border ? 2 : 0,
            borderRadius: border ? 2 : 0,
          },
        ]}
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
    if (this.props.layout.id === 1) {
      return this.renderImage(1, false);
    }
    if (this.props.layout.id === 2) {
      return (
        <View style={Styles.imagesBackground}>
          <View style={Styles.leftFull}>{this.renderImage(1)}</View>
          <View style={Styles.rightFull}>{this.renderImage(2)}</View>
        </View>
      );
    }
    if (this.props.layout.id === 3) {
      return (
        <View style={Styles.imagesBackground}>
          <View style={Styles.leftFull}>{this.renderImage(1)}</View>
          <View style={Styles.rightContainer}>
            <View style={Styles.rightTop}>{this.renderImage(2)}</View>
            <View style={Styles.rightBottom}>{this.renderImage(3)}</View>
          </View>
        </View>
      );
    }
    return (
      <View style={Styles.imagesBackground}>
        <View style={Styles.leftContainer}>
          <View style={Styles.leftTop}>{this.renderImage(1)}</View>
          <View style={Styles.leftBottom}>{this.renderImage(3)}</View>
        </View>
        <View style={Styles.rightContainer}>
          <View style={Styles.rightTop}>{this.renderImage(2)}</View>
          <View style={Styles.rightBottom}>{this.renderImage(4)}</View>
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
          style={[
            Styles.sideBackground,
            {
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
            },
          ]}
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
            Styles.sideBackground,
            {
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

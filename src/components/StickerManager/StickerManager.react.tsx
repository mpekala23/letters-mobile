/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  View,
  Animated,
  PanResponderInstance,
  PanResponder,
} from 'react-native';
import { Sticker, PlacedSticker } from 'types';
import { distance } from '@utils';
import TrashCan from '@assets/stickers/TrashCan';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import Icon from '../Icon/Icon.react';
import Styles from './StickerManager.styles';
import StickerComponent from './StickerComponent.react';

const TRASH_RADIUS = 24;
const TRASH_ANIM_DURATION = 20;

interface Props {
  active: boolean;
  width: number;
  height: number;
  updateStickers: (placedStickers: PlacedSticker[]) => void;
}

interface State {
  stickers: PlacedSticker[];
  trashPosition: {
    x: number;
    y: number;
  };
  trashing: boolean;
  trashAnim: Animated.Value;
  dragging: boolean;
}

export default class StickerManager extends React.Component<Props, State> {
  private stickerId = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      stickers: [],
      trashPosition: {
        x: props.width / 2 - TRASH_RADIUS,
        y: props.height - TRASH_RADIUS * (3 / 2),
      },
      trashing: false,
      trashAnim: new Animated.Value(0),
      dragging: false,
    };
    this.addSticker.bind(this);
    this.updatePosition.bind(this);
  }

  setTrashing(val: boolean): void {
    this.setState({ trashing: val });
    Animated.timing(this.state.trashAnim, {
      toValue: val ? 1 : 0,
      duration: TRASH_ANIM_DURATION,
      useNativeDriver: false,
    }).start();
  }

  addSticker(sticker: Sticker): void {
    this.setState(
      (prevState) => {
        const newStickers = [...prevState.stickers];
        newStickers.push({
          sticker,
          position: {
            x: this.props.width / 2,
            y: this.props.height / 2,
          },
          id: this.stickerId,
        });
        this.stickerId += 1;
        return { ...prevState, stickers: newStickers };
      },
      () => this.props.updateStickers(this.state.stickers)
    );
  }

  updatePosition(id: number, dx: number, dy: number): void {
    if (this.state.trashing) {
      this.setState(
        (prevState) => {
          const newStickers = prevState.stickers.filter(
            (sticker) => sticker.id !== id
          );
          return { ...prevState, stickers: newStickers };
        },
        () => this.setTrashing(false)
      );
      return;
    }
    const ix = this.state.stickers.findIndex(
      (placedSticker) => placedSticker.id === id
    );
    if (ix < 0) return;
    this.setState(
      (prevState) => {
        const newStickers = [...prevState.stickers];
        newStickers[ix].position = {
          x: newStickers[ix].position.x + dx,
          y: newStickers[ix].position.y + dy,
        };
        return { ...prevState, stickers: newStickers };
      },
      () => this.props.updateStickers(this.state.stickers)
    );
  }

  render(): JSX.Element {
    return (
      <View style={[Styles.background]}>
        {this.state.stickers.map((placedSticker) => (
          <StickerComponent
            key={placedSticker.id}
            sticker={placedSticker.sticker}
            position={placedSticker.position}
            updatePosition={(x, y) => {
              this.updatePosition(placedSticker.id, x, y);
            }}
            hoverOver={(x, y) => {
              this.setTrashing(
                distance(
                  { x, y },
                  {
                    x: this.state.trashPosition.x + TRASH_RADIUS,
                    y: this.state.trashPosition.y + TRASH_RADIUS,
                  }
                ) < TRASH_RADIUS
              );
            }}
            setDragging={(dragging) => this.setState({ dragging })}
          />
        ))}
        {this.state.dragging && (
          <Animated.View
            style={{
              width: TRASH_RADIUS * 2,
              height: TRASH_RADIUS * 2,
              borderRadius: TRASH_RADIUS,
              position: 'absolute',
              backgroundColor: 'white',
              left: this.state.trashPosition.x,
              top: this.state.trashPosition.y,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
              transform: [
                {
                  scale: this.state.trashAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.4],
                  }),
                },
              ],
            }}
          >
            <Icon svg={TrashCan} />
          </Animated.View>
        )}
      </View>
    );
  }
}

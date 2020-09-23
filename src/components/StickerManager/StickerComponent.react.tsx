/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { PanResponderInstance, Animated, PanResponder } from 'react-native';
import { Sticker } from 'types';
import {
  PinchGestureHandler,
  RotationGestureHandler,
} from 'react-native-gesture-handler';
import Styles, { STICKER_SIZE } from './StickerComponent.styles';
import Icon from '../Icon/Icon.react';

interface Props {
  sticker: Sticker;
  position: { x: number; y: number };
  updatePosition: (dx: number, dy: number) => void;
  hoverOver: (x: number, y: number) => void;
  setDragging: (val: boolean) => void;
}

export default class StickerComponent extends React.Component<Props> {
  private panResponder: PanResponderInstance;

  private animatedLocation: Animated.ValueXY;

  private lastScale = 1;

  private baseScale: Animated.Value;

  private pinchScale: Animated.Value;

  private scale: Animated.AnimatedMultiplication;

  private lastRotation = 0;

  private rotation: Animated.Value;

  private locValue: { x: number; y: number };

  constructor(props: Props) {
    super(props);
    this.animatedLocation = new Animated.ValueXY();
    this.baseScale = new Animated.Value(1);
    this.pinchScale = new Animated.Value(1);
    this.scale = Animated.multiply(this.baseScale, this.pinchScale);
    this.rotation = new Animated.Value(0);
    this.locValue = {
      x: props.position.x - STICKER_SIZE / 2,
      y: props.position.y - STICKER_SIZE / 2,
    };
    this.animatedLocation.setValue({ x: this.locValue.x, y: this.locValue.y });
    this.animatedLocation.addListener((value) => {
      this.locValue = value;
    });

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length < 2,
      onMoveShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length < 2,
      onPanResponderGrant: (e, g) => {
        this.animatedLocation.setOffset({
          x: this.locValue.x,
          y: this.locValue.y,
        });
        this.animatedLocation.setValue({ x: 0, y: 0 });
        this.props.setDragging(true);
      },
      onPanResponderMove: (e, gestureState) => {
        this.animatedLocation.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
        this.props.hoverOver(
          this.props.position.x + gestureState.dx,
          this.props.position.y + gestureState.dy
        );
      },
      onPanResponderRelease: (e, gestureState) => {
        this.animatedLocation.flattenOffset();
        this.props.updatePosition(gestureState.dx, gestureState.dy);
        this.props.setDragging(false);
      },
    });
  }

  render(): JSX.Element {
    return (
      <RotationGestureHandler
        onGestureEvent={(e) => {
          this.rotation.setValue(e.nativeEvent.rotation);
        }}
        onHandlerStateChange={(e) => {
          this.lastRotation += e.nativeEvent.rotation;
          this.rotation.setOffset(this.lastRotation);
          this.rotation.setValue(0);
        }}
      >
        <PinchGestureHandler
          onGestureEvent={(e) => {
            this.pinchScale.setValue(e.nativeEvent.scale);
          }}
          onHandlerStateChange={(e) => {
            this.lastScale *= e.nativeEvent.scale;
            this.baseScale.setValue(this.lastScale);
            this.pinchScale.setValue(1);
          }}
        >
          <Animated.View
            style={[
              Styles.item,
              {
                transform: [
                  {
                    translateX: this.animatedLocation.x,
                  },
                  {
                    translateY: this.animatedLocation.y,
                  },
                ],
              },
            ]}
          >
            <Animated.View
              style={{
                transform: [{ scale: this.scale }, { rotateZ: this.rotation }],
              }}
              {...this.panResponder.panHandlers}
            >
              <Icon svg={this.props.sticker.svg} />
            </Animated.View>
          </Animated.View>
        </PinchGestureHandler>
      </RotationGestureHandler>
    );
  }
}

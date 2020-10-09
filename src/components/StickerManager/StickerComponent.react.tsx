/* eslint-disable react/jsx-props-no-spreading */
import React, { createRef } from 'react';
import { PanResponderInstance, Animated, PanResponder } from 'react-native';
import { Sticker } from 'types';
import {
  PinchGestureHandler,
  RotationGestureHandler,
} from 'react-native-gesture-handler';
import Styles, { STICKER_SIZE } from './StickerComponent.styles';

interface Props {
  sticker: Sticker;
  position: { x: number; y: number };
  updatePosition: (dx: number, dy: number) => void;
  updateRotation: (rotation: string) => void;
  updateScale: (scale: number) => void;
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

  private pinchRef = createRef<PinchGestureHandler>();

  private rotateRef = createRef<RotationGestureHandler>();

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
      onPanResponderGrant: () => {
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
        ref={this.rotateRef}
        onGestureEvent={(e) => {
          this.rotation.setValue(e.nativeEvent.rotation);
          this.props.setDragging(false);
        }}
        onHandlerStateChange={(e) => {
          this.lastRotation += e.nativeEvent.rotation;
          this.rotation.setOffset(this.lastRotation);
          this.rotation.setValue(0);
          this.props.updateRotation(`${this.lastRotation.toString()}rad`);
        }}
        simultaneousHandlers={this.pinchRef}
      >
        <PinchGestureHandler
          ref={this.pinchRef}
          onGestureEvent={(e) => {
            this.pinchScale.setValue(e.nativeEvent.scale);
            this.props.setDragging(false);
          }}
          onHandlerStateChange={(e) => {
            this.lastScale *= e.nativeEvent.scale;
            this.baseScale.setValue(this.lastScale);
            this.pinchScale.setValue(1);
            this.props.updateScale(this.lastScale);
          }}
          simultaneousHandlers={this.rotateRef}
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
                flex: 1,
              },
            ]}
          >
            <Animated.View
              style={{
                transform: [
                  { scale: this.scale },
                  {
                    rotateZ: this.rotation.interpolate({
                      inputRange: [0, 3.1415],
                      outputRange: ['0rad', '3.1415rad'],
                    }),
                  },
                ],
              }}
              {...this.panResponder.panHandlers}
            >
              {this.props.sticker.component}
            </Animated.View>
          </Animated.View>
        </PinchGestureHandler>
      </RotationGestureHandler>
    );
  }
}

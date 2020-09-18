/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { View, Animated, PanResponderInstance } from 'react-native';
import { Sticker } from 'types';
import Styles from './StickerManager.styles';

interface Props {
  activeSticker: Sticker | null;
}

export default class StickerManager extends React.Component {
  private panResponder: PanResponderInstance;

  private animatedLocation: Animated.ValueXY;

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {},
      onPanResponderMove: Animated.event([
        null,
        { dx: this.animatedLocation.x, dy: this.animatedLocation.y },
      ]),
      onPanResponderRelease: (e, gestureState) => {},
    });
  }

  render() {
    return (
      <View style={Styles.background} {...this.panResponder.panHandlers} />
    );
  }
}

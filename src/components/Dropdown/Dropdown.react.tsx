import React, { createRef } from 'react';
import { Text, View, Animated, TouchableOpacity } from 'react-native';

import { Typography } from '@styles';
import Styles from './Dropdown.styles';

const DROPDOWN_HEIGHT = 100;
const ANIM_DURATION = 500;
const DROP_DURATION = 4000;

export enum DropType {
  Success = 'Success',
  Warning = 'Warning',
  Error = 'Error',
}

export interface DropNotif {
  type: DropType;
  message: string | JSX.Element;
  dynamic?: boolean;
  persist: boolean;
  duration: number;
  onPress?: () => void;
  id?: number;
}

interface State {
  dropped: boolean;
  height: Animated.Value;
  notifQ: DropNotif[];
  animating: boolean;
}

export class Dropdown extends React.Component<Record<string, unknown>, State> {
  private numNotifs = 1;

  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      dropped: false,
      height: new Animated.Value(-DROPDOWN_HEIGHT),
      notifQ: [],
      animating: false,
    };
    this.queueNotif = this.queueNotif.bind(this);
    this.flushNotif = this.flushNotif.bind(this);
    this.endNotif = this.endNotif.bind(this);
    this.renderNotif = this.renderNotif.bind(this);
  }

  queueNotif(notif: DropNotif): void {
    const newNotif = notif;
    newNotif.id = this.numNotifs;
    this.numNotifs += 1;
    this.setState(
      ({ notifQ }) => {
        const currentNotifs = [...notifQ];
        currentNotifs.push(notif);
        return {
          notifQ: currentNotifs,
        };
      },
      () => {
        this.flushNotif();
      }
    );
  }

  // convenient success dropdown
  queueSuccess({
    message,
    dynamic,
    onPress,
    persist,
    duration,
  }: {
    message: string | JSX.Element;
    dynamic?: boolean;
    onPress: () => void;
    persist: boolean;
    duration: number;
  }): void {
    const successNotif: DropNotif = {
      type: DropType.Success,
      message,
      dynamic,
      onPress,
      persist,
      duration,
    };
    this.queueNotif(successNotif);
  }

  // convenient success dropdown
  queueWarning({
    message,
    dynamic,
    onPress,
    persist,
    duration,
  }: {
    message: string | JSX.Element;
    dynamic?: boolean;
    onPress: () => void;
    persist: boolean;
    duration: number;
  }): void {
    const successNotif: DropNotif = {
      type: DropType.Warning,
      message,
      dynamic,
      onPress,
      persist,
      duration,
    };
    this.queueNotif(successNotif);
  }

  // convenient error dropdown
  queueError({
    message,
    dynamic,
    onPress,
    persist,
    duration,
  }: {
    message: string | JSX.Element;
    dynamic?: boolean;
    onPress: () => void;
    persist: boolean;
    duration: number;
  }): void {
    const errorNotif: DropNotif = {
      type: DropType.Error,
      message,
      dynamic,
      onPress,
      persist,
      duration,
    };
    this.queueNotif(errorNotif);
  }

  flushNotif(): void {
    if (
      this.state.dropped ||
      this.state.animating ||
      this.state.notifQ.length === 0
    )
      return;
    this.setState({ dropped: true, animating: true }, () => {
      const currentId = this.state.notifQ[0].id || -1;
      Animated.timing(this.state.height, {
        toValue: 0,
        duration: ANIM_DURATION,
        useNativeDriver: false,
      }).start(() => {
        // when the animation finishes
        this.setState({ animating: false });
        if (!this.state.notifQ[0].persist)
          setTimeout(() => {
            this.endNotif(currentId);
          }, this.state.notifQ[0].duration);
      });
    });
  }

  endNotif(id: number): void {
    if (
      !this.state.dropped ||
      this.state.animating ||
      this.state.notifQ.length === 0 ||
      this.state.notifQ[0].id !== id
    )
      return;
    this.setState({ animating: true }, () => {
      Animated.timing(this.state.height, {
        toValue: -DROPDOWN_HEIGHT,
        duration: ANIM_DURATION,
        useNativeDriver: false,
      }).start(() => {
        // when the animation finishes
        this.setState(
          (prevState) => {
            const newState = { ...prevState };
            newState.notifQ.splice(0, 1);
            newState.dropped = false;
            newState.animating = false;
            return newState;
          },
          () => {
            // when the notifQ has been updated
            if (this.state.notifQ.length > 0) {
              this.flushNotif();
            }
          }
        );
      });
    });
  }

  renderNotif(): JSX.Element {
    const notif = this.state.notifQ[0];
    if (!notif) return <View />;
    let typeBackground = Styles.errorBackground;
    let typeText = Styles.errorText;
    if (notif.type === DropType.Warning) {
      typeBackground = Styles.warningBackground;
      typeText = Styles.warningText;
    } else if (notif.type === DropType.Success) {
      typeBackground = Styles.successBackground;
      typeText = Styles.successText;
    }
    return this.state.dropped ? (
      <TouchableOpacity
        testID="touchable"
        style={[Styles.commonBackground, typeBackground]}
        onPress={() => {
          if (notif.onPress) notif.onPress();
          if (notif.id) this.endNotif(notif.id);
        }}
        activeOpacity={0.9}
      >
        {notif.dynamic ? (
          notif.message
        ) : (
          <Text style={[Typography.FONT_MEDIUM, typeText]}>
            {notif.message}
          </Text>
        )}
      </TouchableOpacity>
    ) : (
      <View />
    );
  }

  render(): JSX.Element {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          zIndex: 999,
          elevation: 999,
          top: this.state.height,
          width: '100%',
        }}
      >
        {this.renderNotif()}
      </Animated.View>
    );
  }
}

const dropdownRef = createRef<Dropdown>();
const DropdownInstance = (): JSX.Element => (
  <Dropdown ref={dropdownRef} key="Dropdown" />
);

export function dropdownSuccess({
  message,
  dynamic,
  onPress,
  persist,
  duration,
}: {
  message?: string | JSX.Element;
  dynamic?: boolean;
  onPress?: () => void;
  persist?: boolean;
  duration?: number;
}): void {
  if (dropdownRef.current)
    dropdownRef.current.queueSuccess({
      message: message || '',
      dynamic,
      onPress: onPress || (() => null),
      persist: persist || false,
      duration: duration || DROP_DURATION,
    });
}

export function dropdownWarning({
  message,
  dynamic,
  onPress,
  persist,
  duration,
}: {
  message?: string | JSX.Element;
  dynamic?: boolean;
  onPress?: () => void;
  persist?: boolean;
  duration?: number;
}): void {
  if (dropdownRef.current)
    dropdownRef.current.queueWarning({
      message: message || '',
      dynamic,
      onPress: onPress || (() => null),
      persist: persist || false,
      duration: duration || DROP_DURATION,
    });
}

export function dropdownError({
  message,
  dynamic,
  onPress,
  persist,
  duration,
}: {
  message?: string | JSX.Element;
  dynamic?: boolean;
  onPress?: () => void;
  persist?: boolean;
  duration?: number;
}): void {
  if (dropdownRef.current)
    dropdownRef.current.queueError({
      message: message || '',
      dynamic,
      onPress: onPress || (() => null),
      persist: persist || false,
      duration: duration || DROP_DURATION,
    });
}

export default DropdownInstance;

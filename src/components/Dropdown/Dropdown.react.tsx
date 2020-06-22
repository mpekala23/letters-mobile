import React, { createRef } from 'react';
import {
  Text,
  View,
  Animated,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { STATUS_BAR_HEIGHT } from '@utils';
import { Typography, Colors } from '@styles';

const DROPDOWN_HEIGHT = 100;
const ANIM_DURATION = 500;
const DROP_DURATION = 4000;

export interface DropNotif {
  title: string;
  body: string;
  icon?: string;
  onPress?: () => void;
  backgroundStyle?: ViewStyle;
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
    const currentNotifs = this.state.notifQ;
    currentNotifs.push(newNotif);
    this.setState(
      (prevState) => {
        const newState = { ...prevState };
        newState.notifQ = [...newState.notifQ, newNotif];
        return newState;
      },
      () => {
        this.flushNotif();
      }
    );
  }

  // convenient info dropdown
  queueInfo(
    infoString: string,
    body: string,
    onPress = () => {
      /* nothing */
    }
  ): void {
    const errorNotif: DropNotif = {
      title: `Info: ${infoString}`,
      body,
      onPress,
      icon: 'poll',
      backgroundStyle: { backgroundColor: Colors.AMEELIO_BLUE },
    };
    this.queueNotif(errorNotif);
  }

  // convenient success dropdown
  queueSuccess(
    successString: string,
    body: string,
    onPress = () => {
      /* nothing */
    }
  ): void {
    const errorNotif: DropNotif = {
      title: `Success: ${successString}`,
      body,
      onPress,
      icon: 'done',
      backgroundStyle: { backgroundColor: Colors.SUCCESS },
    };
    this.queueNotif(errorNotif);
  }

  // convenient warning dropdown
  queueWarning(
    warningString: string,
    body: string,
    onPress = () => {
      /* nothing */
    }
  ): void {
    const errorNotif: DropNotif = {
      title: `Warning: ${warningString}`,
      body,
      onPress,
      icon: 'warning',
      backgroundStyle: { backgroundColor: Colors.WARNING },
    };
    this.queueNotif(errorNotif);
  }

  // convenient error dropdown
  queueError(
    errorString: string,
    body: string,
    onPress = () => {
      /* nothing */
    }
  ): void {
    const errorNotif: DropNotif = {
      title: `Error: ${errorString}`,
      body,
      onPress,
      icon: 'error',
      backgroundStyle: { backgroundColor: Colors.ERROR },
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
        this.setState({ animating: false });
        // when the animation finishes
        setTimeout(() => {
          this.endNotif(currentId);
        }, DROP_DURATION);
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
            newState.notifQ.slice(1);
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

  // TODO: Hook in custom icon component here
  renderNotif(): JSX.Element {
    const notif = this.state.notifQ[0];
    if (!notif) return <View />;
    const icon = notif.icon ? <View /> : <View />;
    return this.state.dropped ? (
      <TouchableOpacity
        testID="touchable"
        style={[
          {
            flex: 1,
            zIndex: 999,
            padding: STATUS_BAR_HEIGHT,
            justifyContent: 'center',
          },
          notif.backgroundStyle,
        ]}
        onPress={() => {
          if (notif.onPress) notif.onPress();
          if (notif.id) this.endNotif(notif.id);
        }}
        activeOpacity={0.9}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon}
          <View
            style={{ justifyContent: 'center', marginLeft: STATUS_BAR_HEIGHT }}
          >
            <Text style={[Typography.FONT_BOLD, { fontSize: 18 }]}>
              {this.state.notifQ[0].title}
            </Text>
            <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
              {this.state.notifQ[0].body}
            </Text>
          </View>
        </View>
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

export function dropdownInfo(
  infoString: string,
  body: string,
  onPress = () => {
    /* nothing */
  }
): void {
  if (dropdownRef.current)
    dropdownRef.current.queueInfo(infoString, body, onPress);
}

export function dropdownSuccess(
  successString: string,
  body: string,
  onPress = () => {
    /* nothing */
  }
): void {
  if (dropdownRef.current)
    dropdownRef.current.queueSuccess(successString, body, onPress);
}

export function dropdownWarning(
  warningString: string,
  body: string,
  onPress = () => {
    /* nothing */
  }
): void {
  if (dropdownRef.current)
    dropdownRef.current.queueWarning(warningString, body, onPress);
}

export function dropdownError(
  errorString: string,
  body: string,
  onPress = () => {
    /* nothing */
  }
): void {
  if (dropdownRef.current)
    dropdownRef.current.queueError(errorString, body, onPress);
}

export function customDropdown(notif: DropNotif): void {
  if (dropdownRef.current) dropdownRef.current.queueNotif(notif);
}

export default DropdownInstance;

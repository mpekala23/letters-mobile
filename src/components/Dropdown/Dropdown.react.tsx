import React, { createRef } from "react";
import { StatusBar, Text, View } from "react-native";
import { Animated, TouchableOpacity } from "react-native";
import { STATUS_BAR_HEIGHT } from "@utils";
import { Typography, Colors } from "@styles";

const DROPDOWN_HEIGHT = 100;
const ANIM_DURATION = 500;
const DROP_DURATION = 4000;

export interface DropNotif {
  title: string;
  body: string;
  icon?: string;
  onPress?: () => void;
  backgroundStyle?: object;
  id?: number;
}

interface State {
  dropped: boolean;
  height: Animated.Value;
  notifQ: DropNotif[];
  animating: boolean;
}

interface Props {}

export class Dropdown extends React.Component<Props, State> {
  private numNotifs = 1;

  constructor(props: Props) {
    super(props);
    this.state = {
      dropped: false,
      height: new Animated.Value(-DROPDOWN_HEIGHT),
      notifQ: [],
      animating: false,
    };
    this.queueNotif = this.queueNotif.bind(this);
    this._flushNotif = this._flushNotif.bind(this);
    this._endNotif = this._endNotif.bind(this);
    this.renderNotif = this.renderNotif.bind(this);
  }

  queueNotif(notif: DropNotif) {
    notif.id = this.numNotifs;
    this.numNotifs += 1;
    const currentNotifs = this.state.notifQ;
    currentNotifs.push(notif);
    this.setState({ notifQ: currentNotifs }, () => {
      this._flushNotif();
    });
  }

  // convenient info dropdown
  queueInfo(infoString: string, body: string, onPress = () => {}) {
    const errorNotif: DropNotif = {
      title: "Info: " + infoString,
      body: body,
      onPress: onPress,
      icon: "poll",
      backgroundStyle: { backgroundColor: Colors.AMEELIO_BLUE },
    };
    this.queueNotif(errorNotif);
  }

  // convenient success dropdown
  queueSuccess(successString: string, body: string, onPress = () => {}) {
    const errorNotif: DropNotif = {
      title: "Success: " + successString,
      body: body,
      onPress: onPress,
      icon: "done",
      backgroundStyle: { backgroundColor: Colors.SUCCESS },
    };
    this.queueNotif(errorNotif);
  }

  // convenient warning dropdown
  queueWarning(warningString: string, body: string, onPress = () => {}) {
    const errorNotif: DropNotif = {
      title: "Warning: " + warningString,
      body: body,
      onPress: onPress,
      icon: "warning",
      backgroundStyle: { backgroundColor: Colors.WARNING },
    };
    this.queueNotif(errorNotif);
  }

  // convenient error dropdown
  queueError(errorString: string, body: string, onPress = () => {}) {
    const errorNotif: DropNotif = {
      title: "Error: " + errorString,
      body: body,
      onPress: onPress,
      icon: "error",
      backgroundStyle: { backgroundColor: Colors.ERROR },
    };
    this.queueNotif(errorNotif);
  }

  _flushNotif() {
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
          this._endNotif(currentId);
        }, DROP_DURATION);
      });
    });
  }

  _endNotif(id: number) {
    if (
      !this.state.dropped ||
      this.state.animating ||
      this.state.notifQ.length === 0 ||
      this.state.notifQ[0].id != id
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
          {
            notifQ: this.state.notifQ.slice(1),
            dropped: false,
            animating: false,
          },
          () => {
            // when the notifQ has been updated
            if (this.state.notifQ.length > 0) {
              this._flushNotif();
            }
          }
        );
      });
    });
  }

  renderNotif() {
    const notif = this.state.notifQ[0];
    if (!notif) return <View />;
    const icon =
      notif.icon || true ? (
        /*<Icon
          size={DROPDOWN_HEIGHT - STATUS_BAR_HEIGHT * 2}
          name={notif.icon || ""}
        ></Icon>*/ <View />
      ) : (
        <View />
      );
    return this.state.dropped ? (
      <TouchableOpacity
        testID="touchable"
        style={[
          {
            flex: 1,
            zIndex: 999,
            padding: STATUS_BAR_HEIGHT,
            justifyContent: "center",
          },
          notif.backgroundStyle,
        ]}
        onPress={() => {
          if (notif.onPress) notif.onPress();
          if (notif.id) this._endNotif(notif.id);
        }}
        activeOpacity={0.9}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {icon}
          <View
            style={{ justifyContent: "center", marginLeft: STATUS_BAR_HEIGHT }}
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

  render() {
    return (
      <Animated.View
        style={{
          position: "absolute",
          zIndex: 999,
          top: this.state.height,
          width: "100%",
        }}
      >
        {this.renderNotif()}
      </Animated.View>
    );
  }
}

let dropdownRef = createRef<Dropdown>();
const DropdownInstance = () => <Dropdown ref={dropdownRef} key="Dropdown" />;

export function dropdownInfo(
  infoString: string,
  body: string,
  onPress = () => {}
) {
  dropdownRef.current?.queueInfo(infoString, body, onPress);
}

export function dropdownSuccess(
  successString: string,
  body: string,
  onPress = () => {}
) {
  dropdownRef.current?.queueSuccess(successString, body, onPress);
}

export function dropdownWarning(
  warningString: string,
  body: string,
  onPress = () => {}
) {
  dropdownRef.current?.queueWarning(warningString, body, onPress);
}

export function dropdownError(
  errorString: string,
  body: string,
  onPress = () => {}
) {
  dropdownRef.current?.queueError(errorString, body, onPress);
}

export function customDropdown(notif: DropNotif) {
  dropdownRef.current?.queueNotif(notif);
}

export default DropdownInstance;

import React, { createRef } from 'react';
import {
  Text,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Colors, Typography } from '@styles';
import Button from '../Button/Button.react';
import Styles, { GRAY_BACK } from './Alert.styles';
import { setStatusBackground } from '../Statusbar/Statusbar.react';

interface AlertButton {
  text?: string;
  reverse?: boolean;
  onPress?: () => void;
  textStyle?: TextStyle | TextStyle[];
  containerStyle?: ViewStyle | ViewStyle[];
}

interface AlertInfo {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
}

interface State {
  current: AlertInfo | null;
  opacity: Animated.Value;
}

class Alert extends React.Component<Record<string, unknown>, State> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      current: null,
      opacity: new Animated.Value(0.0),
    };
    this.setCurrent = this.setCurrent.bind(this);
  }

  setCurrent(info: AlertInfo | null): void {
    if (info) this.setState({ current: info });
    Animated.timing(this.state.opacity, {
      toValue: info ? 1.0 : 0.0,
      duration: info ? 0 : 80,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ current: info });
    });
  }

  render(): JSX.Element {
    if (!this.state.current) return <View />;
    return (
      <Animated.View
        style={[Styles.trueBackground, { opacity: this.state.opacity }]}
      >
        <TouchableOpacity
          style={Styles.trueBackground}
          onPress={() => {
            this.setCurrent(null);
            setStatusBackground('white');
          }}
          activeOpacity={1.0}
        >
          <View style={Styles.alertBackground}>
            <Text
              style={[
                Typography.FONT_BOLD,
                { fontSize: 20, textAlign: 'center', marginBottom: 18 },
              ]}
            >
              {this.state.current.title}
            </Text>
            {this.state.current.message && (
              <>
                <Text
                  style={[
                    Typography.FONT_REGULAR,
                    {
                      fontSize: 16,
                      textAlign: 'center',
                      color: Colors.GRAY_DARK,
                    },
                  ]}
                >
                  {this.state.current.message}
                </Text>
                <View style={{ height: 32 }} />
              </>
            )}
            {this.state.current.buttons &&
              this.state.current.buttons.map((button) => {
                return (
                  <Button
                    key={button.text}
                    buttonText={button.text}
                    reverse={button.reverse}
                    onPress={() => {
                      if (button.onPress) button.onPress();
                      this.setCurrent(null);
                      setStatusBackground('white');
                    }}
                    textStyle={button.textStyle}
                    containerStyle={
                      button.containerStyle
                        ? button.containerStyle
                        : { width: '100%' }
                    }
                  />
                );
              })}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const alertRef = createRef<Alert>();
const AlertInstance = (): JSX.Element => <Alert ref={alertRef} key="Alert" />;

export function popupAlert(pop: AlertInfo): void {
  setStatusBackground(Platform.OS === 'ios' ? GRAY_BACK : 'rgb(145,145,145)');
  if (alertRef.current) {
    alertRef.current.setCurrent({
      title: pop.title,
      message: pop.message,
      buttons: pop.buttons,
    });
  } else {
    setStatusBackground('white');
  }
}

export default AlertInstance;

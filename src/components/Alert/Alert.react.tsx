import React, { createRef } from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { Typography } from '@styles';
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
}

class Alert extends React.Component<Record<string, unknown>, State> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      current: null,
    };
  }

  render(): JSX.Element {
    if (!this.state.current) return <View />;
    return (
      <View style={Styles.trueBackground}>
        <View style={Styles.alertBackground}>
          <Text
            style={[
              Typography.FONT_BOLD,
              { fontSize: 23, textAlign: 'center', marginBottom: 10 },
            ]}
          >
            {this.state.current.title}
          </Text>
          <Text
            style={[
              Typography.FONT_REGULAR,
              { fontSize: 16, textAlign: 'center' },
            ]}
          >
            {this.state.current.message}
          </Text>
          <View style={{ height: 40 }} />
          {this.state.current.buttons &&
            this.state.current.buttons.map((button) => {
              return (
                <Button
                  key={button.text}
                  buttonText={button.text}
                  reverse={button.reverse}
                  onPress={() => {
                    if (button.onPress) button.onPress();
                    this.setState({ current: null });
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
      </View>
    );
  }
}

const alertRef = createRef<Alert>();
const AlertInstance = (): JSX.Element => <Alert ref={alertRef} key="Alert" />;

export function popupAlert(pop: AlertInfo): void {
  setStatusBackground(GRAY_BACK);
  if (alertRef.current)
    alertRef.current.setState({
      current: {
        title: pop.title,
        message: pop.message,
        buttons: pop.buttons,
      },
    });
}

export default AlertInstance;

import React from 'react';
import { Animated, Text, View } from 'react-native';
import { Colors, Typography } from '@styles';
import { Prompts, getRandomPromptIx } from '@utils';
import i18n from '@i18n';
import Shuffle from '@assets/views/Compose/Shuffle';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from '../Icon/Icon.react';
import Button from '../Button/Button.react';

const DEFAULT_CLOSED_HEIGHT = 60;
const DEFAULT_OPEN_HEIGHT = 120;
const ANIM_DURATION = 250;

interface Props {
  recipientName: string;
  closedHeight: number;
  openHeight: number;
}

interface State {
  open: boolean;
  animating: boolean;
  height: Animated.Value;
  promptIx: number;
}

class ComposeHeader extends React.Component<Props, State> {
  static defaultProps = {
    closedHeight: DEFAULT_CLOSED_HEIGHT,
    openHeight: DEFAULT_OPEN_HEIGHT,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      animating: false,
      height: new Animated.Value(props.closedHeight),
      promptIx: getRandomPromptIx(),
    };
  }

  open(): void {
    if (this.state.animating) return;
    this.setState({ animating: true }, () => {
      Animated.timing(this.state.height, {
        toValue: this.props.openHeight,
        duration: ANIM_DURATION,
        useNativeDriver: false,
      }).start(() => {
        this.setState({ animating: false, open: true });
      });
    });
  }

  close(): void {
    if (this.state.animating) return;
    this.setState({ animating: true }, () => {
      Animated.timing(this.state.height, {
        toValue: this.props.closedHeight,
        duration: ANIM_DURATION,
        useNativeDriver: false,
      }).start(() => {
        this.setState((prevState) => {
          return {
            ...prevState,
            animating: false,
            open: false,
            promptIx: (prevState.promptIx + 1) % Prompts.length,
          };
        });
      });
    });
  }

  render(): JSX.Element {
    return (
      <Animated.View
        style={{
          height: this.state.height,
          width: '100%',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[
              Typography.FONT_MEDIUM,
              { flex: 1, fontSize: 14, marginTop: 8 },
            ]}
          >
            {i18n.t('Compose.to')}: {this.props.recipientName}
          </Text>
          {this.state.open ? (
            <TouchableOpacity
              onPress={() => {
                this.setState((prevState) => {
                  return {
                    ...prevState,
                    promptIx: (prevState.promptIx + 1) % Prompts.length,
                  };
                });
              }}
            >
              <Icon svg={Shuffle} style={{ marginRight: 16 }} />
            </TouchableOpacity>
          ) : null}
          <Button
            buttonText={
              this.state.open
                ? i18n.t('Compose.collapse')
                : i18n.t('Compose.needIdeas')
            }
            onPress={() => {
              if (this.state.open) this.close();
              else this.open();
            }}
            textStyle={{ fontSize: 14 }}
            containerStyle={{ width: 130 }}
          />
        </View>
        {this.state.open || (!this.state.open && this.state.animating) ? (
          <Animated.View
            style={{
              height: '60%',
              backgroundColor: Colors.PINK_LIGHTEST,
              borderRadius: 8,
            }}
          >
            <Animated.Text
              style={[
                Typography.FONT_REGULAR,
                { flex: 1, fontSize: 16, padding: 12 },
                {
                  opacity: this.state.height.interpolate({
                    inputRange: [
                      this.props.closedHeight,
                      this.props.openHeight,
                    ],
                    outputRange: [0, 1],
                  }),
                },
              ]}
              testID="prompt"
            >
              {Prompts[this.state.promptIx]}
            </Animated.Text>
          </Animated.View>
        ) : null}
      </Animated.View>
    );
  }
}

export default ComposeHeader;

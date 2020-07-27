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
const DEFAULT_OPEN_HEIGHT = 150;
const ANIM_DURATION = 250;

interface Props {
  recipientName: string;
  closedHeight: number;
  openHeight: number;
}

interface State {
  open: boolean;
  animating: boolean;
  progress: Animated.Value;
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
      progress: new Animated.Value(0),
      promptIx: getRandomPromptIx(),
    };
  }

  open(): void {
    if (this.state.animating) return;
    this.setState({ animating: true }, () => {
      Animated.timing(this.state.progress, {
        toValue: 1,
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
      Animated.timing(this.state.progress, {
        toValue: 0,
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
          height: this.state.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [this.props.closedHeight, this.props.openHeight],
          }),
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
          {this.state.open || this.state.animating ? (
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
              <Animated.View style={{ opacity: this.state.progress }}>
                <Icon svg={Shuffle} style={{ marginRight: 16 }} />
              </Animated.View>
            </TouchableOpacity>
          ) : null}
          <Button
            onPress={() => {
              if (this.state.open) this.close();
              else this.open();
            }}
            containerStyle={{ width: 130, height: 35 }}
          >
            <Animated.Text
              style={[
                Typography.FONT_BOLD,
                {
                  fontSize: 14,
                  color: 'white',
                  position: 'absolute',
                  opacity: this.state.progress.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.3, 1],
                  }),
                },
              ]}
            >
              {i18n.t('Compose.collapse')}
            </Animated.Text>
            <Animated.Text
              style={[
                Typography.FONT_BOLD,
                {
                  fontSize: 14,
                  color: 'white',
                  position: 'absolute',
                  opacity: this.state.progress.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0.3, 0],
                  }),
                },
              ]}
            >
              {i18n.t('Compose.needIdeas')}
            </Animated.Text>
          </Button>
        </View>
        {this.state.open || this.state.animating ? (
          <Animated.View
            style={{
              height: 100,
              width: '100%',
              backgroundColor: Colors.PINK_LIGHTEST,
              borderRadius: 8,
              opacity: this.state.progress,
            }}
          >
            <Animated.Text
              style={[
                Typography.FONT_REGULAR,
                {
                  flex: 1,
                  fontSize: 16,
                  padding: 12,
                  opacity: this.state.progress,
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

import React from 'react';
import { Animated, Text, View } from 'react-native';
import { Typography } from '@styles';
import { Prompts, getRandomPromptIx } from '@utils';
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
          <Text style={[Typography.FONT_BOLD, { flex: 1, fontSize: 18 }]}>
            To: {this.props.recipientName}
          </Text>
          <Button
            buttonText={this.state.open ? 'Collapse' : 'Feeling Stuck?'}
            onPress={() => {
              if (this.state.open) this.close();
              else this.open();
            }}
          />
        </View>
        {this.state.open || (!this.state.open && this.state.animating) ? (
          <Animated.Text
            style={[
              Typography.FONT_BOLD,
              { flex: 1, fontSize: 18 },
              {
                opacity: this.state.height.interpolate({
                  inputRange: [this.props.closedHeight, this.props.openHeight],
                  outputRange: [0, 1],
                }),
              },
            ]}
            testID="prompt"
          >
            {Prompts[this.state.promptIx]}
          </Animated.Text>
        ) : null}
      </Animated.View>
    );
  }
}

export default ComposeHeader;

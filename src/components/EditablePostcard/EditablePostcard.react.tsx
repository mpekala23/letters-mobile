import React, { createRef } from 'react';
import { View, Animated, Image, Text } from 'react-native';
import { PostcardDesign } from 'types';
import Stamp from '@assets/views/Compose/Stamp';
import i18n from '@i18n';
import { Typography } from '@styles';
import Styles from './EditablePostcard.styles';
import Icon from '../Icon/Icon.react';
import Input from '../Input/Input.react';

interface Props {
  design: PostcardDesign;
  flip?: Animated.Value;
  onChangeText: (text: string) => void;
  active?: boolean;
}

class EditablePostcard extends React.Component<Props> {
  static defaultProps = {
    active: true,
  };

  private inputRef = createRef<Input>();

  focus(): void {
    if (this.props.active && this.inputRef.current)
      this.inputRef.current.forceFocus();
  }

  render(): JSX.Element {
    return (
      <Animated.View
        style={[
          Styles.background,
          {
            transform:
              this.props.active && this.props.flip
                ? [
                    {
                      rotateY: this.props.flip.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 3.14159265],
                      }),
                    },
                  ]
                : undefined,
          },
        ]}
      >
        <Animated.View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            opacity:
              this.props.active && this.props.flip
                ? this.props.flip.interpolate({
                    inputRange: [0, 0.4999, 0.5, 1],
                    outputRange: [1, 1, 0, 0],
                  })
                : 1,
          }}
        >
          <Image style={{ flex: 1 }} source={this.props.design.image} />
        </Animated.View>
        <Animated.View
          style={[
            {
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.05)',
              opacity:
                this.props.active && this.props.flip
                  ? this.props.flip.interpolate({
                      inputRange: [0, 0.4999, 0.5, 1],
                      outputRange: [0, 0, 1, 1],
                    })
                  : 0,
              transform: [{ rotateY: 3.1415926 }],
            },
            Styles.writingBackground,
          ]}
        >
          <View style={{ flex: 1, height: '105%' }}>
            <Input
              numLines={1000}
              parentStyle={{ flex: 1 }}
              inputStyle={{ flex: 1, fontSize: 14 }}
              placeholder={i18n.t('Compose.tapToAddMessage')}
              onChangeText={this.props.onChangeText}
              ref={this.inputRef}
            />
          </View>
          <View style={Styles.writingDivider} />
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Icon
              style={{ position: 'absolute', top: 10, right: 10 }}
              svg={Stamp}
            />
            <View>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                Mark Pekala
              </Text>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                Mark's House
              </Text>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                210 W Diamond Lake Road
              </Text>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                Minneapolis, MN 55419
              </Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

export default EditablePostcard;

import React, { createRef } from 'react';
import { View, Animated, Image, Text } from 'react-native';
import { PostcardDesign } from 'types';
import Stamp from '@assets/views/Compose/Stamp';
import i18n from '@i18n';
import { Typography, Colors } from '@styles';
import { Contact } from '@store/Contact/ContactTypes';
import Styles from './EditablePostcard.styles';
import Icon from '../Icon/Icon.react';
import Input from '../Input/Input.react';

interface Props {
  design: PostcardDesign;
  flip?: Animated.Value;
  onChangeText: (text: string) => void;
  recipient: Contact;
}

class EditablePostcard extends React.Component<Props> {
  static defaultProps = {
    active: true,
  };

  private inputRef = createRef<Input>();

  constructor(props: Props) {
    super(props);
    this.focus = this.focus.bind(this);
    this.set = this.set.bind(this);
  }

  focus(): void {
    if (this.inputRef.current) this.inputRef.current.forceFocus();
  }

  set(value: string): void {
    if (this.inputRef.current) this.inputRef.current.set(value);
  }

  render(): JSX.Element {
    return (
      <Animated.View
        style={[
          Styles.background,
          {
            transform: this.props.flip
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
            opacity: this.props.flip
              ? this.props.flip.interpolate({
                  inputRange: [0, 0.4999, 0.5, 1],
                  outputRange: [1, 1, 0, 0],
                })
              : 1,
          }}
        >
          {this.props.design.image.uri !== '' ? (
            <Image
              style={{ width: '100%', height: '100%' }}
              source={this.props.design.image}
            />
          ) : (
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: Colors.GRAY_LIGHT,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={[Typography.FONT_REGULAR, { color: 'black' }]}>
                {i18n.t('Compose.noDesignSelected')}
              </Text>
            </View>
          )}
        </Animated.View>
        <Animated.View
          style={[
            {
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.05)',
              opacity: this.props.flip
                ? this.props.flip.interpolate({
                    inputRange: [0, 0.4999, 0.5, 1],
                    outputRange: [0, 0, 1, 1],
                  })
                : 0,
              transform: [{ rotateY: 3.14159265 }],
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
                {this.props.recipient.firstName} {this.props.recipient.lastName}
                , {this.props.recipient.inmateNumber}
              </Text>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                {this.props.recipient.facility?.name}
              </Text>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                {this.props.recipient.facility?.address}
              </Text>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                {this.props.recipient.facility?.city},{' '}
                {this.props.recipient.facility?.state}{' '}
                {this.props.recipient.facility?.postal}
              </Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

export default EditablePostcard;

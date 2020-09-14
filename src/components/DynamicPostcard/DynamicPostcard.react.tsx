import React, { createRef } from 'react';
import {
  View,
  Animated,
  Text,
  TouchableOpacity,
  Image as ImageComponent,
} from 'react-native';
import { Contact, Layout } from 'types';
import Stamp from '@assets/views/Compose/Stamp';
import i18n from '@i18n';
import { Typography, Colors } from '@styles';
import AddImage from '@assets/components/DynamicPostcard/AddImage';
import MailingAddressPreview from '../MailingAddressPreview/MailingAddressPreview.react';
import Styles from './DynamicPostcard.styles';
import Icon from '../Icon/Icon.react';
import Input from '../Input/Input.react';

interface Props {
  layout: Layout;
  commonLayout: Layout;
  flip?: Animated.Value;
  onChangeText: (text: string) => void;
  recipient: Contact;
  onLoad?: () => void;
  width: number;
  height: number;
  onImageAdd: (position: number) => void;
  activePosition: number;
  highlightActive: boolean;
}

class DynamicPostcard extends React.Component<Props> {
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

  renderImage(position: number): JSX.Element {
    const design = this.props.layout.positions[position];
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F7F7F7',
          borderColor:
            this.props.layout.id !== 1 &&
            position === this.props.activePosition &&
            this.props.highlightActive
              ? Colors.BLUE_300
              : 'transparent',
          borderWidth: 2,
          borderRadius: 2,
        }}
        onPress={() => this.props.onImageAdd(position)}
      >
        {!design ? (
          <Icon svg={AddImage} />
        ) : (
          <ImageComponent
            style={{ width: '100%', height: '100%' }}
            source={design.image}
          />
        )}
      </TouchableOpacity>
    );
  }

  renderImages(): JSX.Element {
    if (this.props.layout.id === 1) {
      return this.renderImage(1);
    }
    if (this.props.layout.id === 2) {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            flexDirection: 'row',
          }}
        >
          <View style={{ flex: 1, padding: 8, paddingRight: 4 }}>
            {this.renderImage(1)}
          </View>
          <View style={{ flex: 1, padding: 8, paddingLeft: 4 }}>
            {this.renderImage(2)}
          </View>
        </View>
      );
    }
    if (this.props.layout.id === 3) {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            flexDirection: 'row',
          }}
        >
          <View style={{ flex: 1, padding: 8, paddingRight: 4 }}>
            {this.renderImage(1)}
          </View>
          <View
            style={{
              flex: 1,
              padding: 10,
              paddingLeft: 5,
              flexDirection: 'column',
            }}
          >
            <View style={{ flex: 1, paddingBottom: 4 }}>
              {this.renderImage(2)}
            </View>
            <View style={{ flex: 1, paddingTop: 4 }}>
              {this.renderImage(3)}
            </View>
          </View>
        </View>
      );
    }
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 8,
            paddingRight: 4,
            flexDirection: 'column',
          }}
        >
          <View style={{ flex: 1, paddingBottom: 4 }}>
            {this.renderImage(1)}
          </View>
          <View style={{ flex: 1, paddingTop: 4 }}>{this.renderImage(3)}</View>
        </View>
        <View
          style={{
            flex: 1,
            padding: 8,
            paddingLeft: 4,
            flexDirection: 'column',
          }}
        >
          <View style={{ flex: 1, paddingBottom: 4 }}>
            {this.renderImage(2)}
          </View>
          <View style={{ flex: 1, paddingTop: 4 }}>{this.renderImage(4)}</View>
        </View>
      </View>
    );
  }

  render(): JSX.Element {
    return (
      <Animated.View
        style={[
          Styles.background,
          {
            width: this.props.width,
            height: this.props.height,
            transform: this.props.flip
              ? [
                  {
                    scaleX: this.props.flip.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, -1],
                    }),
                  },
                ]
              : undefined,
          },
        ]}
      >
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
              transform: [{ scaleX: -1 }],
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
            <MailingAddressPreview
              style={{ paddingHorizontal: 8, paddingTop: 24 }}
              recipient={this.props.recipient}
            />
          </View>
        </Animated.View>
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: this.props.flip
              ? this.props.flip.interpolate({
                  inputRange: [0, 0.4999, 0.5, 1],
                  outputRange: [1, 1, 0, 0],
                })
              : 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {this.renderImages()}
        </Animated.View>
      </Animated.View>
    );
  }
}

export default DynamicPostcard;

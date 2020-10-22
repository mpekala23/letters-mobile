import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Draft, MailTypes, Contact } from 'types';
import Stamp from '@assets/views/Compose/Stamp';
import { Typography } from '@styles';
import AsyncImage from '@components/AsyncImage/AsyncImage.react';
import AdjustableText from '@components/Text/AdjustableText.react';
import MailingAddressPreview from '@components/MailingAddressPreview/MailingAddressPreview.react';
import { getPostcardDesignImage } from '@utils';
import Styles from './StaticPostcard.styles';
import Icon from '../Icon/Icon.react';

interface Props {
  front: boolean;
  composing: Draft;
  recipient: Contact;
  width: number;
  height: number;
  style?: ViewStyle;
}

const StaticPostcard: React.FC<Props> = (props: Props) => {
  if (props.composing.type !== MailTypes.Postcard) return <View />;
  return (
    <View
      style={[
        Styles.background,
        { width: props.width, height: props.height },
        props.style,
      ]}
    >
      {props.front ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            opacity: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AsyncImage
            viewStyle={{
              width: '100%',
              height: '100%',
            }}
            source={getPostcardDesignImage(props.composing.design)}
          />
        </View>
      ) : (
        <View
          style={[
            {
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.05)',
              opacity: 1,
            },
            Styles.writingBackground,
          ]}
        >
          <View
            style={{
              flex: 1,
              height: '105%',
              justifyContent: 'center',
            }}
          >
            <AdjustableText
              style={[
                Typography.FONT_REGULAR,
                {
                  fontSize: 16,
                  paddingHorizontal: 10,
                  alignItems: 'center',
                },
              ]}
              numberOfLines={12}
            >
              {props.composing.content}
            </AdjustableText>
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
              recipient={props.recipient}
            />
          </View>
        </View>
      )}
    </View>
  );
};

StaticPostcard.defaultProps = {
  style: {},
};

export default StaticPostcard;

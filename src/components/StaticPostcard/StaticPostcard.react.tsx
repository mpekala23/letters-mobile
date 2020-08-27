import React from 'react';
import { View, Image, Text } from 'react-native';
import { Draft, MailTypes, Contact } from 'types';
import Stamp from '@assets/views/Compose/Stamp';
import { Typography } from '@styles';
import AsyncImage from '@components/AsyncImage/AsyncImage.react';
import Styles from './StaticPostcard.styles';
import Icon from '../Icon/Icon.react';

interface Props {
  front: boolean;
  composing: Draft;
  recipient: Contact;
}

const StaticPostcard: React.FC<Props> = (props: Props) => {
  if (props.composing.type !== MailTypes.Postcard) return <View />;
  return (
    <View style={Styles.background}>
      {props.front ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            opacity: 1,
          }}
        >
          <AsyncImage
            viewStyle={{ width: '100%', height: '100%' }}
            source={
              props.composing.design.thumbnail
                ? props.composing.design.thumbnail
                : props.composing.design.image
            }
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
            <Text
              style={[
                Typography.FONT_REGULAR,
                {
                  fontSize: 14,
                  paddingHorizontal: 10,
                  alignItems: 'center',
                },
              ]}
            >
              {props.composing.content}
            </Text>
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
                {props.recipient.firstName} {props.recipient.lastName},{' '}
                {props.recipient.inmateNumber}
              </Text>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                {props.recipient.facility?.name}
              </Text>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                {props.recipient.facility?.address}
              </Text>
              <Text style={[Typography.FONT_REGULAR, { fontSize: 14 }]}>
                {props.recipient.facility?.city},{' '}
                {props.recipient.facility?.state}{' '}
                {props.recipient.facility?.postal}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default StaticPostcard;

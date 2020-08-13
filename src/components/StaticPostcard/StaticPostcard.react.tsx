import React from 'react';
import { View, Image, Text } from 'react-native';
import { PostcardDesign } from 'types';
import Stamp from '@assets/views/Compose/Stamp';
import { Typography } from '@styles';
import Styles from './StaticPostcard.styles';
import Icon from '../Icon/Icon.react';

interface Props {
  design?: PostcardDesign | undefined;
  content?: string;
}

const StaticPostcard: React.FC<Props> = (props: Props) => {
  return (
    <View style={Styles.background}>
      {props.design ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            opacity: 1,
          }}
        >
          <Image style={{ flex: 1 }} source={props.design.image} />
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
          <View style={{ flex: 1, height: '105%' }}>
            <Text style={[Typography.FONT_REGULAR, { flex: 1, fontSize: 14 }]}>
              {props.content}
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
        </View>
      )}
    </View>
  );
};

StaticPostcard.defaultProps = {
  design: undefined,
  content: '',
};

export default StaticPostcard;

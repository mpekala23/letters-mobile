import React, { useState } from 'react';
import { View, Image as ImageComponent } from 'react-native';
import { WebView } from 'react-native-webview';
import { WINDOW_WIDTH } from '@utils';
import Loading from '@assets/common/loading.gif';

interface Props {
  route: {
    params: {
      uri: string;
    };
  };
}

const InmateLocatorScreen: React.FC<Props> = (props: Props) => {
  const [height, setHeight] = useState('0%');
  return (
    <>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ImageComponent
          source={Loading}
          style={{
            width: 50,
            height: 50,
          }}
        />
      </View>
      <View style={{ width: WINDOW_WIDTH, height }}>
        <WebView
          source={{ uri: props.route.params.uri }}
          onLoad={() => setHeight('100%')}
        />
      </View>
    </>
  );
};

export default InmateLocatorScreen;

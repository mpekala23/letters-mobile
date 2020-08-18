import React, { useState, useEffect } from 'react';
import {
  Image as ImageComponent,
  View,
  ViewStyle,
  ImageStyle,
  Animated,
} from 'react-native';
import { Image } from 'types';
import Loading from '@assets/common/loading.gif';
import Warning from '@assets/common/Warning.png';
import { sleep } from '@utils';

interface Props {
  source: Image;
  viewStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  loadingSize?: number;
  timeout?: number;
}

interface State {
  loaded: boolean;
  timedOut: boolean;
}

const AsyncImage: React.FC<Props> = (props: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [loadOpacity] = useState(new Animated.Value(0.3));

  useEffect(() => {
    const doSetup = async () => {
      await sleep(props.timeout || 1000);
      if (!loaded) {
        setTimedOut(true);
      }
    };
    doSetup();
  }, []);

  let asyncFeedback: JSX.Element = <View />;
  if (!loaded) {
    // the image is still loading / timed out
    if (!timedOut) {
      // still loading
      asyncFeedback = (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ImageComponent
            source={Loading}
            style={{
              width: props.loadingSize,
              height: props.loadingSize,
            }}
          />
        </View>
      );
    } else {
      // timed out
      asyncFeedback = (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ImageComponent
            source={Warning}
            style={{
              width: (props.loadingSize ? props.loadingSize : 30) * 1.5,
              height: (props.loadingSize ? props.loadingSize : 30) * 1.5,
            }}
          />
        </View>
      );
    }
  }

  return (
    <View style={props.viewStyle}>
      <Animated.Image
        source={props.source}
        style={[props.imageStyle, { opacity: loadOpacity }]}
        onLoad={() => {
          if (props.source && props.source.uri && props.source.uri !== '') {
            setLoaded(true);
            setTimedOut(false);
            Animated.timing(loadOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }
        }}
      />
      {asyncFeedback}
    </View>
  );
};

AsyncImage.defaultProps = {
  viewStyle: { flex: 1 },
  imageStyle: { flex: 1 },
  loadingSize: 30,
  timeout: 1000,
};

export default AsyncImage;

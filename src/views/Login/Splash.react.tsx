import React, { useEffect, useState } from 'react';
import { View, Animated } from 'react-native';
import i18n from '@i18n';
import * as Localization from 'expo-localization';
import { Colors } from '@styles';
import WhiteBirdIcon from '@assets/views/Setup/WhiteBirdIcon.png';

const SplashScreen: React.FC = () => {
  const [loadingProgress] = useState<Animated.Value>(new Animated.Value(0));

  useEffect(() => {
    // Localization returns locale in "en-US" format
    const locale = Localization.locale.substring(0, 2);
    i18n.locale = locale;

    Animated.timing(loadingProgress, {
      toValue: 100,
      duration: 2000,
      useNativeDriver: true,
      delay: 1200,
    }).start();
  });

  const imageScale = {
    transform: [
      {
        scale: loadingProgress.interpolate({
          inputRange: [0, 15, 100],
          outputRange: [0.1, 0.06, 16],
        }),
      },
    ],
  };
  return (
    <View
      accessible={false}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.PINK_400,
      }}
    >
      <View accessible accessibilityLabel="Ameelio Logo">
        <Animated.Image source={WhiteBirdIcon} style={[imageScale]} />
      </View>
    </View>
  );
};

export default SplashScreen;

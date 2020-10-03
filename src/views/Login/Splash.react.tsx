import React, { useEffect, useState } from 'react';
import { View, Animated, Image as ImageComponent } from 'react-native';
import i18n from '@i18n';
import * as Localization from 'expo-localization';
import { Colors } from '@styles';
import WhiteBirdIcon from '@assets/views/Setup/WhiteBirdIcon.png';
import { AppState } from '@store/types';
import { connect } from 'react-redux';

interface Props {
  loadingStatus: number;
}

const SplashScreenBase: React.FC<Props> = ({ loadingStatus }: Props) => {
  const [loadingProgress] = useState<Animated.Value>(
    new Animated.Value(loadingStatus)
  );

  useEffect(() => {
    // Localization returns locale in "en-US" format
    const locale = Localization.locale.substring(0, 2);
    i18n.locale = locale;
  });

  useEffect(() => {
    Animated.timing(loadingProgress, {
      toValue: loadingStatus,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [loadingStatus]);

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
        <ImageComponent
          source={WhiteBirdIcon}
          style={{ width: 160, height: 160 }}
        />
      </View>
      <View
        style={{
          marginTop: 40,
          width: 240,
          height: 16,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'flex-start',
          borderRadius: 8,
          padding: 2,
        }}
      >
        <Animated.View
          style={{
            width: loadingProgress.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
            height: '100%',
            backgroundColor: Colors.BLUE_400,
            borderRadius: 6,
          }}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  loadingStatus: state.user.authInfo.loadingStatus,
});
const SplashScreen = connect(mapStateToProps)(SplashScreenBase);

export default SplashScreen;

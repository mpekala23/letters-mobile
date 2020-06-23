import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import i18n from '@i18n';
import * as Localization from 'expo-localization';

import AmeelioLogo from '@assets/Ameelio_Logo.png';

const SplashScreen: React.FC = () => {
  useEffect(() => {
    // Localization returns locale in "en-US" format
    const locale = Localization.locale.substring(0, 2);
    i18n.locale = locale;
  });

  return (
    <View
      accessible={false}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <Image
        style={{ height: 120, aspectRatio: 2015 / 885 }}
        source={AmeelioLogo}
        accessible
        accessibilityLabel="Ameelio Logo"
      />
    </View>
  );
};

export default SplashScreen;

import React, { useEffect } from 'react';
import { View } from 'react-native';
import i18n from '@i18n';
import * as Localization from 'expo-localization';
import { Icon } from '@components';
import AmeelioBirdPink from '@assets/AmeelioBirdPink';

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
      <View accessible accessibilityLabel="Ameelio Logo">
        <Icon svg={AmeelioBirdPink} style={{ padding: 80 }} />
      </View>
    </View>
  );
};

export default SplashScreen;

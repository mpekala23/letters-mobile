import React, { useState } from 'react';

import { Text, View } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

function useFonts(fontMap) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  (async () => {
    await Font.loadAsync(fontMap);
    setFontsLoaded(true);
  })();
  return [fontsLoaded];
}

export default () => {
  const [fontsLoaded] = useFonts({
    'Inter-SemiBoldItalic': 'https://rsms.me/inter/font-files/Inter-SemiBoldItalic.otf?v=3.12',
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Platform Default</Text>
      <Text style={{ fontFamily: 'Inter-Black' }}>Inter Black</Text>
      <Text style={{ fontFamily: 'Inter-SemiBoldItalic' }}>Inter SemiBoldItalic</Text>
    </View>
  );
};

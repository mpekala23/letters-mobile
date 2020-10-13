import React, { useState } from 'react';
import { View, Image as ImageComponent } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { WINDOW_WIDTH } from '@utils';
import Loading from '@assets/common/loading.gif';
import url from 'url';
import { GENERAL_URL } from '@api/Common';
import { AppState } from '@store/types';
import { connect } from 'react-redux';
import { PremiumPack } from 'types';

type CreditPackCheckoutWebViewNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.CreditPackCheckoutWebView
>;

interface Props {
  navigation: CreditPackCheckoutWebViewNavigationProp;
  email: string;
  route: {
    params: {
      pack: PremiumPack;
    };
  };
}

const CreditPackCheckoutWebViewBase = ({ navigation, email, route }: Props) => {
  const [height, setHeight] = useState('0%');

  const handleChange = (e: WebViewNavigation) => {
    if (
      !e.loading &&
      e.url.indexOf(url.resolve(GENERAL_URL, `stripe/success`)) !== -1
    ) {
      navigation.reset({
        index: 0,
        routes: [{ name: Screens.CreditPackPurchaseSuccess }],
      });
    } else if (
      !e.loading &&
      e.url.indexOf(url.resolve(GENERAL_URL, `stripe/cancel`)) !== -1
    ) {
      navigation.goBack();
    }
  };

  return (
    <>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        {height === '0%' && (
          <ImageComponent
            source={Loading}
            style={{
              width: 50,
              height: 50,
            }}
          />
        )}
        <View style={{ width: WINDOW_WIDTH, height }}>
          <WebView
            source={{
              uri: url.resolve(
                GENERAL_URL,
                `stripe/session/${route.params.pack.id}/${email}`
              ),
            }}
            onLoad={() => setHeight('100%')}
            onNavigationStateChange={handleChange}
          />
        </View>
      </View>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  email: state.user.user.email,
});

const CreditPackCheckoutWebViewScreen = connect(mapStateToProps)(
  CreditPackCheckoutWebViewBase
);

export default CreditPackCheckoutWebViewScreen;

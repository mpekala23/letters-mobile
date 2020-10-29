import React, { Dispatch, useState } from 'react';
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
import { PremiumPack, StripeTransaction } from 'types';
import { addPremiumCoins } from '@store/User/UserActions';
import { UserActionTypes } from '@store/User/UserTypes';
import { addStripeTransaction } from '@store/Premium/PremiumActions';
import { PremiumActionTypes } from '@store/Premium/PremiumTypes';

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
  addCoins: (coins: number) => void;
  addTransaction: (transaction: StripeTransaction) => void;
}

const CreditPackCheckoutWebViewBase = ({
  addCoins,
  navigation,
  email,
  route,
  addTransaction,
}: Props) => {
  const [height, setHeight] = useState('0%');

  const { pack } = route.params;
  const handleChange = (e: WebViewNavigation): void => {
    if (e.loading) {
      return;
    }
    if (e.url.indexOf(url.resolve(GENERAL_URL, `stripe/success`)) !== -1) {
      addCoins(pack.coins);
      addTransaction({
        id: 99,
        date: new Date().toISOString(),
        failedReason: null,
        pack: { ...pack, price: pack.price / 100 },
        status: 'success',
      } as StripeTransaction);
      navigation.reset({
        index: 0,
        routes: [{ name: Screens.CreditPackPurchaseSuccess }],
      });
    } else if (
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

const mapDispatchToProps = (
  dispatch: Dispatch<UserActionTypes | PremiumActionTypes>
) => {
  return {
    addCoins: (coins: number) => dispatch(addPremiumCoins(coins)),
    addTransaction: (transaction: StripeTransaction) =>
      dispatch(addStripeTransaction(transaction)),
  };
};

const CreditPackCheckoutWebViewScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditPackCheckoutWebViewBase);

export default CreditPackCheckoutWebViewScreen;

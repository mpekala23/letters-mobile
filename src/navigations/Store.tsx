import React from 'react';
import {
  CreditPackCheckoutWebViewScreen,
  CreditPackStoreScreen,
  CreditPackPurchaseSuccessScreen,
  StoreScreen,
} from '@views';
import { getDetailsFromRouteName, Screens } from '@utils/Screens';
import { HeaderTitle, HeaderLeft, HeaderRight } from '@components';
import { BAR_HEIGHT } from '@utils/Constants';
import { leftRightTransition } from './Transitions';
import { StoreStack } from './Navigators';

const Store: React.FC = () => {
  return (
    <StoreStack.Navigator
      screenOptions={({ route }) => ({
        headerShown: getDetailsFromRouteName(route.name).headerVisible,
        headerStyle: { height: BAR_HEIGHT },
        headerTitle: (titleProps) => {
          return (
            <HeaderTitle
              title={
                titleProps.children
                  ? getDetailsFromRouteName(titleProps.children).title
                  : ''
              }
            />
          );
        },
        headerLeft: (leftProps) => (
          <HeaderLeft
            canGoBack={!!leftProps.canGoBack}
            onPress={leftProps.onPress}
            route={route.name}
          />
        ),
        headerRight: () => {
          return <HeaderRight />;
        },
        cardStyleInterpolator: leftRightTransition,
      })}
    >
      <StoreStack.Screen name={Screens.Store} component={StoreScreen} />
      <StoreStack.Screen
        name={Screens.CreditPackStore}
        component={CreditPackStoreScreen}
      />
      <StoreStack.Screen
        name={Screens.CreditPackCheckoutWebView}
        component={CreditPackCheckoutWebViewScreen}
      />
      <StoreStack.Screen
        name={Screens.CreditPackPurchaseSuccess}
        component={CreditPackPurchaseSuccessScreen}
      />
    </StoreStack.Navigator>
  );
};

export default Store;

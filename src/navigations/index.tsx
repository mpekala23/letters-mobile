import React, { useState } from 'react';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { AuthInfo, UserState } from '@store/User/UserTypes';
import { navigationRef, navigate } from '@utils';
import { setProfile } from '@components/Topbar';
import { NavigationContainer } from '@react-navigation/native';
import HomeIcon from '@assets/navigation/Home';
import StoreIcon from '@assets/navigation/Store';

import i18n from '@i18n';
import {
  Screens,
  AuthStackParamList,
  AppStackParamList,
  getDetailsFromRouteName,
  Tabs,
} from '@utils/Screens';
import { SplashScreen } from '@views';
import { GestureResponderEvent } from 'react-native';
import { RootTab } from './Navigators';

import Auth from './Auth';
import Home from './Home';
import Store from './Store';
import TabIcon from './TabIcon.react';

export { navigationRef, navigate };

export type RootStackParamList = AuthStackParamList & AppStackParamList;

export interface Props {
  authInfo: AuthInfo;
  userState: UserState;
}

const NavigatorBase: React.FC<Props> = (props: Props) => {
  const [tabsVisible, setTabsVisible] = useState(true);

  // Determine which views should be accessible
  let screens;
  if (
    props.authInfo.isLoadingToken ||
    (props.authInfo.isLoggedIn && !props.authInfo.isLoaded)
  ) {
    screens = <RootTab.Screen name={Tabs.Splash} component={SplashScreen} />;
  } else if (!props.authInfo.isLoggedIn) {
    screens = <RootTab.Screen name={Tabs.Auth} component={Auth} />;
  } else {
    screens = (
      <>
        <RootTab.Screen
          name={Tabs.Home}
          component={Home}
          options={{
            tabBarButton: (tabProps) => {
              return (
                <TabIcon
                  name={i18n.t('Navigation.home')}
                  svg={HomeIcon}
                  onPress={(e: GestureResponderEvent) => {
                    if (tabProps.onPress) {
                      tabProps.onPress(e);
                    }
                  }}
                />
              );
            },
          }}
        />
        <RootTab.Screen
          name={Tabs.Store}
          component={Store}
          options={{
            tabBarButton: (tabProps) => {
              return (
                <TabIcon
                  name={i18n.t('Navigation.store')}
                  svg={StoreIcon}
                  onPress={(e: GestureResponderEvent) => {
                    if (tabProps.onPress) {
                      tabProps.onPress(e);
                    }
                  }}
                />
              );
            },
          }}
        />
      </>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        const name = navigationRef.current?.getCurrentRoute()?.name as Screens;
        if (name) {
          setProfile(!!getDetailsFromRouteName(name).profile);
          if (
            getDetailsFromRouteName(name).tabsVisible === undefined ||
            getDetailsFromRouteName(name).tabsVisible === true
          )
            setTabsVisible(true);
          else setTabsVisible(false);
        } else {
          setProfile(true);
          setTabsVisible(true);
        }
      }}
    >
      <RootTab.Navigator
        screenOptions={({ route }) => ({
          tabBarVisible:
            route.name !== Tabs.Auth &&
            route.name !== Tabs.Splash &&
            tabsVisible,
          tabBarVisibilityAnimationConfig: {},
        })}
        tabBarOptions={{
          style: { height: 64 },
          keyboardHidesTabBar: true,
        }}
      >
        {screens}
      </RootTab.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = (state: AppState) => ({
  authInfo: state.user.authInfo,
  userState: state.user,
});
const Navigator = connect(mapStateToProps)(NavigatorBase);

export default Navigator;

import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from '@react-navigation/stack';
import { AppState } from '@store/types';
import { AuthInfo, UserState } from '@store/User/UserTypes';
import { navigationRef, navigate, WINDOW_WIDTH, WINDOW_HEIGHT } from '@utils';
import { setProfile, setShown } from '@components/Topbar';
import { NavigationContainer } from '@react-navigation/native';
import HomeIcon from '@assets/navigation/Home';
import StoreIcon from '@assets/navigation/Store';

import i18n from '@i18n';
import {
  Screens,
  AuthStackParamList,
  AppStackParamList,
  mapRouteNameToDetails,
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

const fadeTransition = (
  data: StackCardInterpolationProps
): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      opacity: data.current.progress,
    },
  };
};

const leftRightTransition = (
  data: StackCardInterpolationProps
): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: data.current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [WINDOW_WIDTH, 0],
          }),
        },
      ],
    },
  };
};

const topBottomTransition = (
  data: StackCardInterpolationProps
): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        {
          translateY: data.current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-WINDOW_HEIGHT, 0],
          }),
        },
      ],
    },
  };
};

const bottomTopTransition = (
  data: StackCardInterpolationProps
): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        {
          translateY: data.current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [WINDOW_HEIGHT, 0],
          }),
        },
      ],
    },
  };
};

const NavigatorBase: React.FC<Props> = (props: Props) => {
  const [tabsVisible, setTabsVisible] = useState(true);

  // Determine which views should be accessible
  let screens;
  if (
    props.authInfo.isLoadingToken ||
    (props.authInfo.isLoggedIn && !props.authInfo.isLoaded)
  ) {
    screens = <RootTab.Screen name="Splash" component={SplashScreen} />;
  } else if (!props.authInfo.isLoggedIn) {
    screens = <RootTab.Screen name="Auth" component={Auth} />;
  } else {
    screens = (
      <>
        <RootTab.Screen
          name="Home"
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
          name="Store"
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
        if (name && name in mapRouteNameToDetails) {
          setProfile(mapRouteNameToDetails[name].profile);
          if (
            mapRouteNameToDetails[name].tabsVisible === undefined ||
            mapRouteNameToDetails[name].tabsVisible === true
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
            route.name !== 'Auth' && route.name !== 'Splash' && tabsVisible,
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

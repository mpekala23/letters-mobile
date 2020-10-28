import React, { useState } from 'react';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { AuthInfo } from '@store/User/UserTypes';
import { navigationRef, navigate, sleep } from '@utils';
import { NavigationContainer } from '@react-navigation/native';
import HomeIcon from '@assets/navigation/Home';
import StoreIcon from '@assets/navigation/Store';
import ActiveStoreIcon from '@assets/navigation/ActiveStore';
import ActiveHomeIcon from '@assets/navigation/ActiveHome';
import { ProfilePic } from '@components';
import { ProfilePicTypes } from 'types';
import { Colors, Typography } from '@styles';

import i18n from '@i18n';
import {
  Screens,
  AuthStackParamList,
  AppStackParamList,
  getDetailsFromRouteName,
  Tabs,
} from '@utils/Screens';
import { SplashScreen } from '@views';
import store from '@store';
import { setTopbarLeft, setTopbarRight } from '@store/UI/UIActions';
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootTab } from './Navigators';

import Auth from './Auth';
import Home from './Home';
import Store from './Store';
import Profile from './Profile';
import TabIcon from './TabIcon.react';

export { navigationRef, navigate };

export type RootStackParamList = AuthStackParamList & AppStackParamList;

export interface Props {
  authInfo: AuthInfo;
  firstName: string;
  lastName: string;
  profilePicUri?: string;
}

const NavigatorBase: React.FC<Props> = ({
  authInfo,
  firstName,
  lastName,
  profilePicUri,
}: Props) => {
  const [tabsVisible, setTabsVisible] = useState(true);
  const [active, setActive] = useState(Tabs.Home);
  const [authed, setAuthed] = useState(false);

  // Determine which views should be accessible
  let screens;
  if (authInfo.isLoadingToken || (authInfo.isLoggedIn && !authInfo.isLoaded)) {
    screens = <RootTab.Screen name={Tabs.Splash} component={SplashScreen} />;
  } else if (!authInfo.isLoggedIn) {
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
                <>
                  <TabIcon
                    name={i18n.t('Navigation.store')}
                    svg={active === Tabs.Store ? ActiveStoreIcon : StoreIcon}
                    active={Tabs.Store === active}
                    onPress={() => {
                      navigate(Tabs.Store);
                      setActive(Tabs.Store);
                    }}
                  />
                  <TabIcon
                    name={i18n.t('Navigation.home')}
                    svg={active === Tabs.Home ? ActiveHomeIcon : HomeIcon}
                    active={Tabs.Home === active}
                    onPress={(e: GestureResponderEvent) => {
                      if (tabProps.onPress) {
                        tabProps.onPress(e);
                      }
                      setActive(Tabs.Home);
                    }}
                  />
                </>
              );
            },
          }}
        />
        <RootTab.Screen
          name={Tabs.Store}
          component={Store}
          options={{
            tabBarButton: () => {
              return null;
            },
          }}
        />
        <RootTab.Screen
          name={Tabs.Profile}
          component={Profile}
          options={{
            tabBarButton: (tabProps) => {
              return (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={(e: GestureResponderEvent) => {
                    if (tabProps.onPress) {
                      tabProps.onPress(e);
                    }
                    setActive(Tabs.Profile);
                  }}
                >
                  <View
                    style={{
                      borderWidth: active === Tabs.Profile ? 2 : 0,
                      borderRadius: 24,
                      borderColor: Colors.PINK_500,
                      padding: 1,
                    }}
                  >
                    <ProfilePic
                      firstName={firstName}
                      lastName={lastName}
                      imageUri={profilePicUri}
                      type={ProfilePicTypes.TabBar}
                    />
                  </View>
                  <Text
                    style={[
                      active === Tabs.Profile
                        ? Typography.FONT_SEMIBOLD
                        : Typography.FONT_REGULAR,
                      {
                        color:
                          active === Tabs.Profile
                            ? Colors.AMEELIO_BLACK
                            : Colors.GRAY_400,
                      },
                    ]}
                  >
                    {i18n.t('Navigation.profile')}
                  </Text>
                </TouchableOpacity>
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
          if (
            getDetailsFromRouteName(name).tabsVisible === undefined ||
            getDetailsFromRouteName(name).tabsVisible === true
          )
            setTabsVisible(true);
          else setTabsVisible(false);
          if (!getDetailsFromRouteName(name).customTopLeft)
            store.dispatch(setTopbarLeft(null));
          if (!getDetailsFromRouteName(name).customTopRight)
            store.dispatch(setTopbarRight(null));
        } else {
          setTabsVisible(true);
          store.dispatch(setTopbarLeft(null));
          store.dispatch(setTopbarRight(null));
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
        initialRouteName={Tabs.Splash}
      >
        {screens}
      </RootTab.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = (state: AppState) => ({
  authInfo: state.user.authInfo,
  firstName: state.user.user.firstName,
  lastName: state.user.user.lastName,
  profilePicUri: state.user.user.photo?.uri,
});
const Navigator = connect(mapStateToProps)(NavigatorBase);

export default Navigator;

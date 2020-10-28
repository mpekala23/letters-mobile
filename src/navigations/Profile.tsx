import React from 'react';
import { UpdateProfileScreen } from '@views';
import { getDetailsFromRouteName, Screens } from '@utils/Screens';
import { HeaderTitle, HeaderRight, HeaderLeft } from '@components';
import { BAR_HEIGHT } from '@utils/Constants';
import { ProfileStack } from './Navigators';

const Store: React.FC = () => {
  return (
    <ProfileStack.Navigator
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
          />
        ),
        headerRight: () => {
          return <HeaderRight />;
        },
      })}
    >
      <ProfileStack.Screen
        name={Screens.UpdateProfile}
        component={UpdateProfileScreen}
      />
    </ProfileStack.Navigator>
  );
};

export default Store;

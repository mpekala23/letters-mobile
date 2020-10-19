import React from 'react';
import { mapRouteNameToDetails, Screens } from '@utils/Screens';
import {
  ChooseCategoryScreen,
  ChooseOptionScreen,
  ComposeLetterScreen,
  ComposePersonalScreen,
  ComposePostcardScreen,
  ContactInfoScreen,
  ContactInmateInfoScreen,
  ContactSelectorScreen,
  FacilityDirectoryScreen,
  InmateLocatorScreen,
  IntroContactScreen,
  IssuesDetailScreen,
  IssuesDetailSecondaryScreen,
  IssuesScreen,
  MailDetailsScreen,
  MailTrackingScreen,
  MemoryLaneScreen,
  ReferFriendsScreen,
  ReferralDashboardScreen,
  ReviewContactScreen,
  ReviewLetterScreen,
  ReviewPostcardScreen,
  SingleContactScreen,
  SupportFAQDetailScreen,
  SupportFAQScreen,
  UpdateContactScreen,
  UpdateProfileScreen,
} from '@views';
import { HeaderLeft, HeaderRight, HeaderTitle } from '@components';
import { BAR_HEIGHT, WINDOW_HEIGHT, WINDOW_WIDTH } from '@utils/Constants';
import {
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from '@react-navigation/stack';
import { HomeStack } from './Navigators';

interface Props {
  headerVisible: boolean;
}

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

const Home: React.FC<Props> = ({ headerVisible }: Props) => {
  return (
    <HomeStack.Navigator
      screenOptions={({ route }) => ({
        headerShown: headerVisible,
        headerStyle: { height: BAR_HEIGHT },
        headerTitle: (titleProps) => {
          return (
            <HeaderTitle
              title={
                titleProps.children &&
                titleProps.children in mapRouteNameToDetails
                  ? mapRouteNameToDetails[titleProps.children].title
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
      <HomeStack.Screen
        name={Screens.ContactSelector}
        component={ContactSelectorScreen}
      />
      <HomeStack.Screen
        name={Screens.ChooseCategory}
        component={ChooseCategoryScreen}
      />
      <HomeStack.Screen
        name={Screens.ChooseOption}
        component={ChooseOptionScreen}
      />
      <HomeStack.Screen
        name={Screens.ComposeLetter}
        component={ComposeLetterScreen}
      />
      <HomeStack.Screen
        name={Screens.ComposePersonal}
        component={ComposePersonalScreen}
      />
      <HomeStack.Screen
        name={Screens.ComposePostcard}
        component={ComposePostcardScreen}
      />
      <HomeStack.Screen
        name={Screens.ReviewLetter}
        component={ReviewLetterScreen}
      />
      <HomeStack.Screen
        name={Screens.ReviewPostcard}
        component={ReviewPostcardScreen}
      />
      <HomeStack.Screen
        name={Screens.ContactInfo}
        component={ContactInfoScreen}
        options={{ cardStyleInterpolator: bottomTopTransition }}
      />
      <HomeStack.Screen
        name={Screens.FacilityDirectory}
        component={FacilityDirectoryScreen}
      />
      <HomeStack.Screen
        name={Screens.ContactInmateInfo}
        component={ContactInmateInfoScreen}
      />
      <HomeStack.Screen
        name={Screens.ReferFriends}
        component={ReferFriendsScreen}
      />
      <HomeStack.Screen
        name={Screens.ReferralDashboard}
        component={ReferralDashboardScreen}
      />
      <HomeStack.Screen
        name={Screens.ReviewContact}
        component={ReviewContactScreen}
      />
      <HomeStack.Screen
        name={Screens.IntroContact}
        component={IntroContactScreen}
      />
      <HomeStack.Screen name={Screens.Issues} component={IssuesScreen} />
      <HomeStack.Screen
        name={Screens.IssuesDetail}
        component={IssuesDetailScreen}
      />
      <HomeStack.Screen
        name={Screens.IssuesDetailSecondary}
        component={IssuesDetailSecondaryScreen}
      />
      <HomeStack.Screen
        name={Screens.SingleContact}
        component={SingleContactScreen}
      />
      <HomeStack.Screen
        name={Screens.MailTracking}
        component={MailTrackingScreen}
      />
      <HomeStack.Screen
        name={Screens.MemoryLane}
        component={MemoryLaneScreen}
      />
      <HomeStack.Screen
        name={Screens.MailDetails}
        component={MailDetailsScreen}
      />
      <HomeStack.Screen
        name={Screens.SupportFAQ}
        component={SupportFAQScreen}
      />
      <HomeStack.Screen
        name={Screens.SupportFAQDetail}
        component={SupportFAQDetailScreen}
      />
      <HomeStack.Screen
        name={Screens.UpdateContact}
        component={UpdateContactScreen}
      />
      <HomeStack.Screen
        name={Screens.UpdateProfile}
        component={UpdateProfileScreen}
        options={{ cardStyleInterpolator: topBottomTransition }}
      />
      <HomeStack.Screen name="InmateLocator" component={InmateLocatorScreen} />
    </HomeStack.Navigator>
  );
};

export default Home;

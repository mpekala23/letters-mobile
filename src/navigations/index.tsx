import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  createStackNavigator,
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from '@react-navigation/stack';
import {
  AddManuallyScreen,
  BeginScreen,
  ChooseCategoryScreen,
  ChooseOptionScreen,
  ContactInfoScreen,
  ComposeLetterScreen,
  ComposePostcardScreen,
  ContactSelectorScreen,
  FacilityDirectoryScreen,
  IssuesScreen,
  IssuesDetailScreen,
  IssuesDetailSecondaryScreen,
  LoginScreen,
  MailTrackingScreen,
  MemoryLaneScreen,
  MailDetailsScreen,
  PrivacyScreen,
  ReferFriendsScreen,
  RegisterCredsScreen,
  RegisterPersonalScreen,
  RegisterAddressScreen,
  ReviewLetterScreen,
  ReviewPostcardScreen,
  ReviewContactScreen,
  SingleContactScreen,
  SplashScreen,
  SupportFAQScreen,
  SupportFAQDetailScreen,
  TermsScreen,
  UpdateContactScreen,
  UpdateProfileScreen,
} from '@views';
import { AppState } from '@store/types';
import { AuthInfo, UserState } from '@store/User/UserTypes';
import { navigationRef, navigate } from '@notifications';
import { Notif } from '@store/Notif/NotifTypes';
import {
  SupportFAQTypes,
  DeliveryReportTypes,
  Category,
  Image,
  MailTypes,
} from 'types';
import Topbar, {
  setTitle,
  topbarRef,
  setProfile,
  setShown,
} from '@components/Topbar/Topbar.react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '@utils';
import i18n from '@i18n';

export { navigationRef, navigate };

export enum Screens {
  Begin = 'Begin',
  Splash = 'Splash',
  Login = 'Login',
  Terms = 'Terms',
  Privacy = 'Privacy',
  RegisterCreds = 'RegisterCreds',
  RegisterPersonal = 'RegisterPersonal',
  RegisterAddress = 'RegisterAddress',
  ReferFriends = 'ReferFriends',
  Delivery = 'DeliveryReporting',
  ContactSelector = 'ContactSelector',
  ChooseCategory = 'ChooseCategory',
  ChooseOption = 'ChooseOption',
  ComposeLetter = 'ComposeLetter',
  ComposePostcard = 'ComposePostcard',
  ReviewLetter = 'ReviewLetter',
  ReviewPostcard = 'ReviewPostcard',
  ContactInfo = 'ContactInfo',
  FacilityDirectory = 'FacilityDirectory',
  AddManually = 'AddManually',
  ReviewContact = 'ReviewContact',
  Issues = 'Issues',
  IssuesDetail = 'IssuesDetail',
  IssuesDetailSecondary = 'IssuesDetailSecondary',
  SingleContact = 'SingleContact',
  MailTracking = 'MailTracking',
  MemoryLane = 'MemoryLane',
  MailDetails = 'MailDetails',
  SupportFAQ = 'SupportFAQ',
  SupportFAQDetail = 'SupportFAQDetail',
  UpdateContact = 'UpdateContact',
  UpdateProfile = 'UpdateProfile',
}

export type AuthStackParamList = {
  Splash: undefined;
  Begin: undefined;
  Login: undefined;
  Terms: undefined;
  Privacy: undefined;
  RegisterCreds: undefined;
  RegisterPersonal: {
    email: string;
    password: string;
    passwordConfirmation: string;
    remember: boolean;
  };
  RegisterAddress: {
    email: string;
    password: string;
    passwordConfirmation: string;
    remember: boolean;
    firstName: string;
    lastName: string;
    referrer: string;
    image: Image | undefined;
  };
};

export type AppStackParamList = {
  AddManually: { phyState: string };
  ChooseCategory: undefined;
  ChooseOption: undefined;
  ComposeLetter: undefined;
  ComposePostcard: { category: Category };
  ContactInfo: { addFromSelector?: boolean; phyState?: string };
  ContactSelector: undefined;
  FacilityDirectory: { phyState: string };
  Issues: undefined;
  IssuesDetail: { issue: DeliveryReportTypes } | undefined;
  IssuesDetailSecondary: { issue: DeliveryReportTypes } | undefined;
  LetterPreview: undefined;
  PostcardPreview: undefined;
  MailDetails: undefined;
  MailTracking: undefined;
  MemoryLane: undefined;
  ReferFriends: { mailType: MailTypes };
  ReviewLetter: undefined;
  ReviewPostcard: { horizontal: boolean; category: string };
  ReviewContact: undefined;
  Setup: undefined;
  SingleContact: undefined;
  Splash: undefined;
  SupportFAQ: undefined;
  SupportFAQDetail: { issue: SupportFAQTypes } | undefined;
  UpdateContact: { contactId: number } | undefined;
  UpdateProfile: undefined;
};

interface RouteDetails {
  title: string;
  profile: boolean;
  shown?: boolean;
}

const mapRouteNameToDetails: Record<string, RouteDetails> = {
  Begin: { title: '', profile: false, shown: false },
  Splash: { title: '', profile: false, shown: false },
  Login: { title: i18n.t('Screens.login'), profile: false },
  Terms: { title: i18n.t('Screens.termsOfService'), profile: false },
  Privacy: { title: i18n.t('Screens.privacyPolicy'), profile: false },
  RegisterCreds: { title: i18n.t('Screens.register'), profile: false },
  RegisterPersonal: { title: i18n.t('Screens.register'), profile: false },
  RegisterAddress: { title: i18n.t('Screens.register'), profile: false },
  AddManually: { title: i18n.t('Screens.addManually'), profile: false },
  ChooseCategory: { title: i18n.t('Screens.compose'), profile: false },
  ChooseOption: { title: i18n.t('Screens.compose'), profile: false },
  ComposeLetter: { title: i18n.t('Screens.compose'), profile: false },
  ComposePostcard: { title: i18n.t('Screens.compose'), profile: false },
  ContactInfo: { title: i18n.t('Screens.contactInfo'), profile: false },
  ContactSelector: { title: i18n.t('Screens.contacts'), profile: true },
  FacilityDirectory: { title: '', profile: false },
  Issues: { title: i18n.t('Screens.issues'), profile: false },
  MailDetails: { title: i18n.t('Screens.letterDetails'), profile: true },
  MailTracking: { title: i18n.t('Screens.tracking'), profile: true },
  MemoryLane: { title: i18n.t('Screens.memoryLane'), profile: true },
  ReferFriends: { title: i18n.t('Screens.spreadTheWord'), profile: false },
  ReviewLetter: { title: i18n.t('Screens.lastStep'), profile: false },
  ReviewPostcard: {
    title: i18n.t('Screens.reviewPostcard'),
    profile: false,
  },
  ReviewContact: { title: i18n.t('Screens.reviewContact'), profile: false },
  Setup: { title: '', profile: false },
  SingleContact: { title: i18n.t('Screens.home'), profile: true },
  UpdateContact: { title: i18n.t('Screens.updateContact'), profile: false },
  UpdateProfile: { title: i18n.t('Screens.updateProfile'), profile: false },
};

export type RootStackParamList = AuthStackParamList & AppStackParamList;

const Stack = createStackNavigator<RootStackParamList>();

export interface Props {
  authInfo: AuthInfo;
  currentNotif: Notif | null;
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
  const [currentRoute, setCurrentRoute] = useState(Screens.Splash);
  const topbar = (
    <Topbar
      userState={props.userState}
      navigation={navigationRef.current}
      currentRoute={currentRoute}
      ref={topbarRef}
    />
  );

  // Determine which views should be accessible
  let screens;
  if (
    props.authInfo.isLoadingToken ||
    (props.authInfo.isLoggedIn && !props.authInfo.isLoaded)
  ) {
    screens = (
      <Stack.Screens
        name={Screens.Splash}
        component={SplashScreen}
        options={{ cardStyleInterpolator: fadeTransition }}
      />
    );
  } else if (!props.authInfo.isLoggedIn) {
    screens = (
      <>
        <Stack.Screens name={Screens.Begin} component={BeginScreen} />
        <Stack.Screens name={Screens.Login} component={LoginScreen} />
        <Stack.Screens name={Screens.Terms} component={TermsScreen} />
        <Stack.Screens name={Screens.Privacy} component={PrivacyScreen} />
        <Stack.Screens
          name={Screens.RegisterCreds}
          component={RegisterCredsScreen}
        />
        <Stack.Screens
          name={Screens.RegisterPersonal}
          component={RegisterPersonalScreen}
        />
        <Stack.Screens
          name={Screens.RegisterAddress}
          component={RegisterAddressScreen}
        />
      </>
    );
  } else {
    screens = (
      <>
        <Stack.Screens
          name={Screens.ContactSelector}
          component={ContactSelectorScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screens
          name={Screens.RegisterAddress}
          component={ChooseCategoryScreen}
        />
        <Stack.Screens
          name={Screens.ChooseOption}
          component={ChooseOptionScreen}
        />
        <Stack.Screens
          name={Screens.ComposeLetter}
          component={ComposeLetterScreen}
        />
        <Stack.Screens
          name={Screens.ComposePostcard}
          component={ComposePostcardScreen}
        />
        <Stack.Screens
          name={Screens.ReviewLetter}
          component={ReviewLetterScreen}
        />
        <Stack.Screens
          name={Screens.ReviewPostcard}
          component={ReviewPostcardScreen}
        />
        <Stack.Screens
          name={Screens.ContactInfo}
          component={ContactInfoScreen}
          options={{
            cardStyleInterpolator:
              Platform.OS === 'ios' ? fadeTransition : bottomTopTransition,
          }}
        />
        <Stack.Screens
          name={Screens.FacilityDirectory}
          component={FacilityDirectoryScreen}
        />
        <Stack.Screens
          name={Screens.AddManually}
          component={AddManuallyScreen}
        />
        <Stack.Screens
          name={Screens.ReferFriends}
          component={ReferFriendsScreen}
        />
        <Stack.Screens
          name={Screens.ReviewContact}
          component={ReviewContactScreen}
        />
        <Stack.Screens name={Screens.Issues} component={IssuesScreen} />
        <Stack.Screens
          name={Screens.IssuesDetail}
          component={IssuesDetailScreen}
        />
        <Stack.Screens
          name={Screens.IssuesDetailSecondary}
          component={IssuesDetailSecondaryScreen}
        />
        <Stack.Screens
          name={Screens.SingleContact}
          component={SingleContactScreen}
        />
        <Stack.Screens
          name={Screens.MailTracking}
          component={MailTrackingScreen}
        />
        <Stack.Screens name={Screens.MemoryLane} component={MemoryLaneScreen} />
        <Stack.Screens
          name={Screens.MailDetails}
          component={MailDetailsScreen}
        />
        <Stack.Screens name={Screens.SupportFAQ} component={SupportFAQScreen} />
        <Stack.Screens
          name={Screens.SupportFAQDetail}
          component={SupportFAQDetailScreen}
        />
        <Stack.Screens
          name={Screens.UpdateContact}
          component={UpdateContactScreen}
          options={{
            cardStyleInterpolator:
              Platform.OS === 'ios' ? fadeTransition : topBottomTransition,
          }}
        />
        <Stack.Screens
          name={Screens.UpdateProfile}
          component={UpdateProfileScreen}
          options={{
            cardStyleInterpolator:
              Platform.OS === 'ios' ? fadeTransition : topBottomTransition,
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
        if (name) setCurrentRoute(name);
        if (name && name in mapRouteNameToDetails) {
          setTitle(mapRouteNameToDetails[name].title);
          setProfile(mapRouteNameToDetails[name].profile);
          if (
            mapRouteNameToDetails[name].shown === undefined ||
            mapRouteNameToDetails[name].shown === true
          )
            setShown(true);
          else setShown(false);
        } else {
          setTitle('');
          setProfile(true);
          setShown(true);
        }
      }}
    >
      {topbar}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator:
            Platform.OS === 'ios' ? fadeTransition : leftRightTransition,
        }}
      >
        {screens}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = (state: AppState) => ({
  authInfo: state.user.authInfo,
  currentNotif: state.notif.currentNotif,
  userState: state.user,
});
const Navigator = connect(mapStateToProps)(NavigatorBase);

export default Navigator;

import i18n from '@i18n';
import {
  Category,
  DeliveryReportTypes,
  MailTypes,
  SupportFAQTypes,
  Image,
  PrisonTypes,
  RouteDetails,
  PremiumPack,
} from 'types';

export enum Tabs {
  Auth = 'Auth',
  Home = 'Home',
  Splash = 'Splash',
  Store = 'Store',
}

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
  ComposePersonal = 'ComposePersonal',
  ComposePostcard = 'ComposePostcard',
  CreditPackCheckoutWebView = 'CreditPackCheckoutWebView',
  CreditPackStore = 'CreditPackStore',
  CreditPackPurchaseSuccess = 'CreditPackPurchaseSuccess',
  ReferralDashboard = 'ReferralDashboard',
  ReviewLetter = 'ReviewLetter',
  ReviewPostcard = 'ReviewPostcard',
  ContactInfo = 'ContactInfo',
  FacilityDirectory = 'FacilityDirectory',
  ContactInmateInfo = 'ContactInmateInfo',
  ReviewContact = 'ReviewContact',
  InmateLocator = 'InmateLocator',
  IntroContact = 'IntroContact',
  Issues = 'Issues',
  IssuesDetail = 'IssuesDetail',
  IssuesDetailSecondary = 'IssuesDetailSecondary',
  Setup = 'Setup',
  SelectPostcardSize = 'SelectPostcardSize',
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
  ChooseCategory: undefined;
  ChooseOption: undefined;
  ComposeLetter: undefined;
  ComposePersonal: { category: Category } | undefined;
  ComposePostcard: { category: Category };
  ContactInfo: { addFromSelector?: boolean; phyState?: string };
  ContactSelector: undefined;
  CreditPackStore: undefined;
  CreditPackCheckoutWebView: { pack: PremiumPack };
  CreditPackPurchaseSuccess: { pack: PremiumPack };
  FacilityDirectory: { phyState: string };
  InmateLocator: { uri: string };
  IntroContact: undefined;
  Issues: undefined;
  IssuesDetail: { issue: DeliveryReportTypes } | undefined;
  IssuesDetailSecondary: { issue: DeliveryReportTypes } | undefined;
  LetterPreview: undefined;
  PostcardPreview: undefined;
  MailDetails: undefined;
  MailTracking: undefined;
  MemoryLane: undefined;
  ReferFriends: { mailType: MailTypes };
  ReferralDashboard: undefined;
  ReviewLetter: undefined;
  ReviewPostcard: { category: string };
  ContactInmateInfo: { manual: boolean; prisonType: PrisonTypes };
  ReviewContact: { manual: boolean };
  SelectPostcardSize: { category: Category };
  Setup: undefined;
  SingleContact: undefined;
  Splash: undefined;
  SupportFAQ: undefined;
  SupportFAQDetail: { issue: SupportFAQTypes } | undefined;
  UpdateContact: { contactId: number } | undefined;
  UpdateProfile: undefined;
};

export const mapRouteNameToDetails: Record<Screens, RouteDetails> = {
  Begin: { title: '', profile: false, headerVisible: false },
  Splash: { title: '', profile: false, headerVisible: false },
  Login: { title: i18n.t('Screens.login'), profile: false },
  Terms: { title: i18n.t('Screens.termsOfService'), profile: false },
  Privacy: { title: i18n.t('Screens.privacyPolicy'), profile: false },
  RegisterCreds: { title: i18n.t('Screens.register'), profile: false },
  RegisterPersonal: { title: i18n.t('Screens.register'), profile: false },
  RegisterAddress: { title: i18n.t('Screens.register'), profile: false },
  ChooseCategory: { title: i18n.t('Screens.compose'), profile: false },
  ChooseOption: { title: i18n.t('Screens.compose'), profile: false },
  ComposeLetter: {
    title: i18n.t('Screens.compose'),
    profile: false,
    tabsVisible: false,
  },
  ComposePersonal: {
    title: i18n.t('Screens.compose'),
    profile: false,
    tabsVisible: false,
  },
  ComposePostcard: {
    title: i18n.t('Screens.compose'),
    profile: false,
    tabsVisible: false,
  },
  ContactInfo: {
    title: i18n.t('Screens.contactInfo'),
    profile: false,
    tabsVisible: false,
  },
  ContactInmateInfo: {
    title: i18n.t('Screens.contactInmateInfo'),
    profile: false,
    tabsVisible: false,
  },
  ContactSelector: { title: i18n.t('Screens.contacts') },
  CreditPackStore: { title: i18n.t('Screens.creditPackStore'), profile: false },
  CreditPackCheckoutWebView: {
    title: i18n.t('Screens.creditPackStore'),
    profile: false,
  },
  CreditPackPurchaseSuccess: {
    title: i18n.t('Screens.creditPackStore'),
    profile: false,
  },
  DeliveryReporting: { title: '', profile: false },
  FacilityDirectory: { title: '', profile: false },
  IntroContact: {
    title: i18n.t('Screens.introContact'),
    profile: false,
    tabsVisible: false,
  },
  InmateLocator: {
    title: i18n.t('Screens.inmateLocator'),
    profile: false,
    tabsVisible: false,
  },
  Issues: {
    title: i18n.t('Screens.issues'),
    profile: false,
    tabsVisible: false,
  },
  IssuesDetail: {
    title: '',
    profile: false,
  },
  IssuesDetailSecondary: {
    title: '',
    profile: false,
  },
  MailDetails: { title: i18n.t('Screens.letterDetails') },
  MailTracking: { title: i18n.t('Screens.tracking') },
  MemoryLane: { title: i18n.t('Screens.memoryLane') },
  ReferralDashboard: {
    title: i18n.t('Screens.referralDashboard'),
  },
  ReferFriends: {
    title: i18n.t('Screens.spreadTheWord'),
    profile: false,
    tabsVisible: false,
  },
  ReviewLetter: {
    title: i18n.t('Screens.lastStep'),
    profile: false,
    tabsVisible: false,
  },
  ReviewPostcard: {
    title: i18n.t('Screens.reviewPostcard'),
    profile: false,
    tabsVisible: false,
  },
  ReviewContact: {
    title: i18n.t('Screens.reviewContact'),
    profile: false,
    tabsVisible: false,
  },
  SelectPostcardSize: { title: i18n.t('Screens.compose'), profile: false },
  Setup: { title: '', profile: false },
  SingleContact: { title: i18n.t('Screens.home') },
  SupportFAQ: { title: '', profile: false },
  SupportFAQDetail: { title: '', profile: false },
  UpdateContact: {
    title: i18n.t('Screens.updateContact'),
    profile: false,
    tabsVisible: false,
  },
  UpdateProfile: {
    title: i18n.t('Screens.updateProfile'),
    profile: false,
    tabsVisible: false,
  },
};

export function getDetailsFromRouteName(screen: string): RouteDetails {
  if (screen in mapRouteNameToDetails)
    return {
      profile: true,
      headerVisible: true,
      tabsVisible: true,
      ...mapRouteNameToDetails[screen as Screens],
    };
  return {
    title: '',
    profile: false,
    headerVisible: true,
    tabsVisible: true,
  };
}

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
  PremadeDesign,
} from 'types';

export enum Tabs {
  Auth = 'Auth',
  Home = 'Home',
  Splash = 'Splash',
  Store = 'Store',
  Profile = 'Profile',
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
  SelectRecipient = 'SelectRecipient',
  StoreItem = 'StoreItem',
  StoreItemPreview = 'StoreItemPreview',
  StoreItemPurchaseSuccess = 'StoreItemPurchaseSuccess',
  SingleContact = 'SingleContact',
  MailTracking = 'MailTracking',
  MailTrackingPdfWebview = 'MailTrackingPdfWebview',
  MailTrackingStore = 'MailTrackingStore',
  MemoryLane = 'MemoryLane',
  MailDetails = 'MailDetails',
  Store = 'Store',
  SupportFAQ = 'SupportFAQ',
  SupportFAQDetail = 'SupportFAQDetail',
  TransactionHistory = 'TransactionHistory',
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
    country: string;
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
  MailTrackingPdfWebview: { uri: string };
  MailTrackingStore: undefined;
  MemoryLane: undefined;
  ReferFriends: { mailType: MailTypes };
  ReferralDashboard: undefined;
  ReviewLetter: undefined;
  ReviewPostcard: { category: string };
  ContactInmateInfo: { manual: boolean; prisonType: PrisonTypes };
  ReviewContact: { manual: boolean };
  SelectPostcardSize: { category: Category };
  SelectRecipient: { item: PremadeDesign };
  Setup: undefined;
  SingleContact: undefined;
  StoreItem: { item: PremadeDesign };
  StoreItemPreview: { uri: string };
  StoreItemPurchaseSuccess: undefined;
  Splash: undefined;
  Store: undefined;
  SupportFAQ: undefined;
  SupportFAQDetail: { issue: SupportFAQTypes } | undefined;
  TransactionHistory: undefined;
  UpdateContact: { contactId: number } | undefined;
  UpdateProfile: undefined;
};

export const mapRouteNameToDetails: Record<Screens, RouteDetails> = {
  Begin: { title: '', headerVisible: false },
  Splash: { title: '', headerVisible: false },
  Login: { title: i18n.t('Screens.login') },
  Terms: { title: i18n.t('Screens.termsOfService') },
  Privacy: { title: i18n.t('Screens.privacyPolicy') },
  RegisterCreds: { title: i18n.t('Screens.register'), customTopRight: true },
  RegisterPersonal: { title: i18n.t('Screens.register'), customTopRight: true },
  RegisterAddress: { title: i18n.t('Screens.register'), customTopRight: true },
  ChooseCategory: { title: i18n.t('Screens.compose') },
  ChooseOption: { title: i18n.t('Screens.compose') },
  ComposeLetter: {
    title: i18n.t('Screens.compose'),
    tabsVisible: false,
    customTopRight: true,
  },
  ComposePersonal: {
    title: i18n.t('Screens.compose'),
    tabsVisible: false,
    customTopRight: true,
    customTopLeft: true,
  },
  ComposePostcard: {
    title: i18n.t('Screens.compose'),
    tabsVisible: false,
    customTopRight: true,
    customTopLeft: true,
  },
  ContactInfo: {
    title: i18n.t('Screens.contactInfo'),
    tabsVisible: false,
    customTopRight: true,
  },
  ContactInmateInfo: {
    title: i18n.t('Screens.contactInmateInfo'),
    tabsVisible: false,
    customTopRight: true,
  },
  ContactSelector: { title: i18n.t('Screens.contacts') },
  CreditPackStore: {
    title: i18n.t('Screens.creditPackStore'),
    tabsVisible: false,
  },
  CreditPackCheckoutWebView: {
    title: i18n.t('Screens.creditPackStore'),
  },
  CreditPackPurchaseSuccess: {
    title: i18n.t('Screens.creditPackStore'),
  },
  DeliveryReporting: { title: '' },
  FacilityDirectory: { title: '', tabsVisible: false, customTopRight: true },
  IntroContact: {
    title: i18n.t('Screens.introContact'),
    tabsVisible: false,
    customTopRight: true,
  },
  InmateLocator: {
    title: i18n.t('Screens.inmateLocator'),
    tabsVisible: false,
  },
  Issues: {
    title: i18n.t('Screens.issues'),
    tabsVisible: false,
  },
  IssuesDetail: {
    title: '',
  },
  IssuesDetailSecondary: {
    title: '',
  },
  MailDetails: { title: i18n.t('Screens.letterDetails') },
  MailTracking: { title: i18n.t('Screens.tracking') },
  MailTrackingPdfWebview: { title: i18n.t('Screens.tracking') },
  MailTrackingStore: { title: i18n.t('Screens.tracking') },
  MemoryLane: { title: i18n.t('Screens.memoryLane') },
  ReferralDashboard: {
    title: i18n.t('Screens.referralDashboard'),
  },
  ReferFriends: {
    title: i18n.t('Screens.spreadTheWord'),
    tabsVisible: false,
  },
  ReviewLetter: {
    title: i18n.t('Screens.lastStep'),
    tabsVisible: false,
    customTopRight: true,
  },
  ReviewPostcard: {
    title: i18n.t('Screens.reviewPostcard'),
    tabsVisible: false,
    customTopRight: true,
  },
  ReviewContact: {
    title: i18n.t('Screens.reviewContact'),
    tabsVisible: false,
  },
  SelectPostcardSize: {
    title: i18n.t('Screens.compose'),
    tabsVisible: false,
    customTopRight: true,
  },
  SelectRecipient: {
    title: i18n.t('Screens.selectRecipient'),
    tabsVisible: false,
  },
  Setup: { title: '' },
  SingleContact: { title: i18n.t('Screens.home') },
  Store: { title: i18n.t('Screens.store') },
  SupportFAQ: { title: '' },
  SupportFAQDetail: { title: '' },
  StoreItem: {
    title: i18n.t('Screens.storeItem'),
    tabsVisible: false,
  },
  StoreItemPreview: {
    title: i18n.t('Screens.storeItemPreview'),
    tabsVisible: false,
  },
  StoreItemPurchaseSuccess: {
    title: i18n.t('Screens.storeItemPreview'),
    tabsVisible: false,
  },
  TransactionHistory: { title: i18n.t('Screens.transactionHistory') },
  UpdateContact: {
    title: i18n.t('Screens.updateContact'),
    tabsVisible: false,
    customTopRight: true,
  },
  UpdateProfile: {
    title: i18n.t('Screens.updateProfile'),
    customTopRight: true,
  },
};

export function getDetailsFromRouteName(screen: string): RouteDetails {
  if (screen in mapRouteNameToDetails)
    return {
      headerVisible: true,
      tabsVisible: true,
      customTopLeft: false,
      customTopRight: false,
      ...mapRouteNameToDetails[screen as Screens],
    };
  return {
    title: '',
    headerVisible: true,
    tabsVisible: true,
    customTopLeft: false,
    customTopRight: false,
  };
}

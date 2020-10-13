import {
  Category,
  DeliveryReportTypes,
  MailTypes,
  SupportFAQTypes,
  Image,
  PrisonTypes,
  PremiumPack,
} from 'types';

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
  IntroContact = 'IntroContact',
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
  Setup: undefined;
  SingleContact: undefined;
  Splash: undefined;
  SupportFAQ: undefined;
  SupportFAQDetail: { issue: SupportFAQTypes } | undefined;
  UpdateContact: { contactId: number } | undefined;
  UpdateProfile: undefined;
};

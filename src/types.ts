/* eslint-disable camelcase */
// Common
export interface Image extends Asset {
  width?: number;
  height?: number;
}

export interface Asset {
  uri: string;
}

export interface Sticker {
  name: string;
  image: Image;
}

export interface PlacedSticker {
  sticker: Sticker;
  position: {
    x: number;
    y: number;
  };
  rotation: string;
  scale: number;
  id: number;
}

export type Subscription = {
  remove: () => void;
};

// Letters and Postcards (Commmon)
export enum MailTypes {
  Letter = 'letter',
  Postcard = 'postcard',
}

export type DesignType =
  | 'packet'
  | 'premade_postcard'
  | 'personal_design'
  | 'fallback';

interface BaseDesign {
  categoryId: number;
  subcategoryName?: string;
}

export interface PersonalDesign extends BaseDesign {
  asset: Image;
  layout?: Layout;
  stickers?: PlacedSticker[];
  type: 'personal_design';
}

export enum CustomFontFamilies {
  BebasNeue = 'BebasNeue-Regular',
  KumbhSans = 'KumbhSans-Regular',
  Lobster = 'Lobster-Regular',
  Montserrat = 'Montserrat-Regular',
  NotoSerifJP = 'NotoSerifJP-Regular',
  ReenieBeanie = 'ReenieBeanie-Regular',
  Satisfy = 'Satisfy-Regular',
}

export interface Font {
  family: CustomFontFamilies;
  color: string;
}

export interface Customization {
  font: Font;
}

export interface BasePremadeDesign extends BaseDesign {
  id: number;
  name: string;
  blurb: string;
  designer?: string;
  contentResearcher?: string;
  author?: string;
  type: DesignType;
  thumbnail: Image;
  price: number;
  productId: number;
}

interface PacketSpecific {
  asset: Asset;
  type: 'packet';
}

interface PostcardDesignSpecific {
  asset: Image;
  type: 'premade_postcard';
}

export type PremadePostcardDesign = BasePremadeDesign & PostcardDesignSpecific;
export type DesignPacket = BasePremadeDesign & PacketSpecific;

export type PremadeDesign = PremadePostcardDesign | DesignPacket;
export type PostcardDesign = PremadePostcardDesign | PersonalDesign;

interface LetterSpecific {
  type: MailTypes.Letter;
  images: Image[];
  pdf?: string;
}

interface PostcardSpecific {
  type: MailTypes.Postcard;
  design: PostcardDesign;
  size: PostcardSizeOption;
  customization: Customization;
}

export enum MailStatus {
  Draft = 'Draft',
  Created = 'Created Order',
  Mailed = 'Mailed',
  InTransit = 'In Transit',
  InLocalArea = 'In Local Area',
  ProcessedForDelivery = 'Out for Delivery',
  Delivered = 'Delivered to Facility',
  ReturnedToSender = 'Returned to Sender',
  Rerouted = 'Re-Routed',
}

export interface RawCategory {
  created_at: string;
  id: 1;
  img_src: string;
  name: string;
  updated_at: string;
  blurb: string;
  premium: boolean;
  active: boolean;
}

export interface Category {
  id: number;
  name: string;
  image: Image;
  blurb: string;
  subcategories: Record<string, PremadeDesign[]>;
  premium: boolean;
}

export interface Layout {
  id: number;
  designs: Record<number, PersonalDesign | null>;
  svg: string;
}

// Letters and Postcards (Draft)
interface DraftInfo {
  type: MailTypes;
  recipientId: number;
  content: string;
}

export type DraftLetter = DraftInfo & LetterSpecific;

export type DraftPostcard = DraftInfo & PostcardSpecific;

export type Draft = DraftLetter | DraftPostcard;

// Letters and Postcards (Mail)
interface MailInfo extends DraftInfo {
  id: number;
  status: MailStatus;
  dateCreated: string;
  expectedDelivery: string;
  trackingEvents?: TrackingEvent[];
  lobPdfUrl?: string;
}

export type MailLetter = MailInfo & LetterSpecific;

export type MailPostcard = MailInfo & PostcardSpecific;

export type MailPacket = MailInfo & DesignPacket;

export type Mail = MailLetter | MailPostcard | MailPacket;

export enum PostcardSize {
  Small = '4x6',
  Medium = '6x9',
  Large = '6x11',
}

export interface PostcardSizeOption {
  key: PostcardSize;
  image: Image;
  title: string;
  wordsLimit: number;
  cost: number;
  isPremium: boolean;
}

// Facilities
export enum PrisonTypes {
  State = 'State Prison',
  Federal = 'Federal Prison',
  County = 'County Jail',
  Immigration = 'ICE Detention Center',
  Juvenile = 'Juvenile Detention Center',
  Fallback = 'Facility',
}

export interface Facility {
  name: string;
  fullName?: string;
  type: PrisonTypes;
  address: string;
  city: string;
  state: string;
  postal: string;
  phone: string;
}

// Contacts
export interface ContactPersonal {
  firstName: string;
  lastName: string;
  relationship: string;
  image?: Image;
}

export interface ContactFacility {
  facility: Facility;
}

export interface ContactInmateInfo {
  inmateNumber: string;
  dorm?: string;
  unit?: string;
}

interface ContactCreated {
  id: number;
  totalSent: number;
  mailPage: number;
  hasNextPage: boolean;
  backgroundColor: string;
}

export interface ContactDraft
  extends ContactPersonal,
    ContactFacility,
    ContactInmateInfo {}

export interface Contact extends ContactDraft, ContactCreated {}

// Tracking and Reporting
export interface ZipcodeInfo {
  zip: string;
  city: string;
  state: string;
  lat?: number;
  long?: number;
}

export enum SupportFAQTypes {
  DeleteLetter = 'DeleteLetter',
  NotArrived = 'NotArrived',
  WrongReturnAddress = 'WrongReturnAddress',
  WrongMailingAddress = 'WrongMailingAddress',
  TrackingNumber = 'TrackingNumber',
  TrackingError = 'TrackingError',
  TalkToAmeelio = 'TalkToAmeelio',
}

export enum DeliveryReportTypes {
  received = 'received',
  unsure = 'unsure',
  notYetReceived = 'notYetReceived',
  haveNotAsked = 'haveNotAsked',
  haveNotReceived = 'haveNotReceived',
}

export interface TrackingEvent {
  id: number;
  name: string;
  location?: ZipcodeInfo;
  date: Date;
}

export interface FamilyConnection {
  contactImage: string;
  contactFirstName: string;
  contactLastName: string;
  userFirstName: string;
  userLastName: string;
  userImage: string;
  city: string;
  state: string;
}

export interface UserReferralsInfo {
  families: FamilyConnection[];
  numReferrals: number;
  numLivesImpacted: number;
  numMailSent: number;
}

// Miscelaneous
export enum ProfilePicTypes {
  Topbar = 'Topbar',
  Contact = 'Contact',
  SingleContact = 'SingleContact',
  Avatar = 'Avatar',
  ReferralDashboard = 'ReferralDashboard',
  ReferralDashboardConnection = 'ReferralDashboardConnection',
}

export enum Storage {
  RememberToken = 'Ameelio-Token',
  DraftType = 'Ameelio-DraftType',
  DraftContent = 'Ameelio-DraftContent',
  DraftRecipientId = 'Ameelio-DraftRecipientId',
  DraftImages = 'Ameelio-DraftImages',
  DraftCategoryId = 'Ameelio-DraftCategoryId',
  DraftSubcategoryName = 'Ameelio-DraftSubcategoryName',
  DraftDesignUri = 'Ameelio-DraftDesignUri',
  DraftLayout = 'Ameelio-DraftLayout',
  DraftPostcardSize = 'Ameelio-DraftPostcardSize',
}

export type DesignBottomDetails = 'layout' | 'design' | 'stickers';

export type TextBottomDetails = 'color' | 'font';

export type ComposeBottomDetails = 'layout' | 'design' | 'stickers';

// Premium
export type PremiumPack = {
  id: number;
  name: string;
  image: Image;
  price: number;
  coins: number;
};

export type PremiumTransaction = {
  id: number;
  date: string;
  contactFullName: string;
  contactId: number;
  productName: string;
  productId: number;
  mailId: number;
  price: number;
  status: 'completed' | 'error' | 'refund';
  thumbnail: Image;
};

export type StripeTransaction = {
  id: number;
  date: string;
  failedReason: string | null;
  pack: PremiumPack;
  status: 'success' | string;
};

export enum EntityTypes {
  Contacts = 'Contacts',
  Mail = 'Mail',
  Referrals = 'Referrals',
  Categories = 'Categories',
  MailDetail = 'MailDetail',
  PremiumPacks = 'PremiumPacks',
  PremiumStoreItems = 'PremiumStoreItems',
  PremiumTransactions = 'PremiumTransactions',
  StripeTransactions = 'StripeTransactions',
}

// UI
export interface TopbarRight {
  enabled: boolean;
  text: string;
  action: () => void | Promise<void>;
  blocking?: boolean;
}

export interface TopbarLeft {
  canGoBack?: boolean;
  action?: () => void | Promise<void>;
}

export interface RouteDetails {
  title: string;
  profile?: boolean;
  headerVisible?: boolean;
  tabsVisible?: boolean;
}

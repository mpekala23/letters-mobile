// Common
export interface Image {
  uri: string;
  width?: number;
  height?: number;
}

export interface Sticker {
  component: JSX.Element;
  name: string;
}

export interface PlacedSticker {
  sticker: Sticker;
  position: {
    x: number;
    y: number;
  };
  rotation: number;
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

export interface PostcardDesign {
  image: Image;
  thumbnail?: Image;
  id?: number;
  categoryId?: number;
  subcategoryName?: string;
  name?: string;
  author?: string;
  custom?: boolean;
}

interface LetterSpecific {
  type: MailTypes.Letter;
  images: Image[];
}

interface PostcardSpecific {
  type: MailTypes.Postcard;
  design: PostcardDesign;
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

export interface Category {
  id: number;
  name: string;
  image: Image;
  blurb: string;
  subcategories: Record<string, PostcardDesign[]>;
}

export interface Layout {
  id: number;
  designs: Record<number, PostcardDesign | null>;
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
  dateCreated: Date;
  expectedDelivery: Date;
  trackingEvents?: TrackingEvent[];
}

export type MailLetter = MailInfo & LetterSpecific;

export type MailPostcard = MailInfo & PostcardSpecific;

export type Mail = MailLetter | MailPostcard;

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
  inmateNumber: string;
  relationship: string;
  image?: Image;
}

export interface ContactFacility {
  facility: Facility;
  dorm?: string;
  unit?: string;
}

interface ContactCreated {
  id: number;
}

export interface ContactDraft extends ContactPersonal, ContactFacility {}

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
}

export type TopbarBackAction = {
  action: () => void | Promise<void>;
};

export type TopbarRouteAction = {
  enabled: boolean;
  text: string;
  action: () => void | Promise<void>;
  blocking?: boolean;
};

import { CategoryState } from './Category/CategoryTypes';
import { ContactState } from './Contact/ContactTypes';
import { FacilityState } from './Facility/FacilityTypes';
import { MailState } from './Mail/MailTypes';
import { NotifState } from './Notif/NotifTypes';
import { UserState } from './User/UserTypes';
import { ZipState } from './Zip/ZipTypes';

export interface AppState {
  category: CategoryState;
  contact: ContactState;
  facility: FacilityState;
  mail: MailState;
  notif: NotifState;
  user: UserState;
  zip: ZipState;
}

import { ContactState } from './Contact/ContactTypes';
import { MailState } from './Mail/MailTypes';
import { NotifState } from './Notif/NotifTypes';
import { UserState } from './User/UserTypes';

export interface AppState {
  contact: ContactState;
  mail: MailState;
  notif: NotifState;
  user: UserState;
}

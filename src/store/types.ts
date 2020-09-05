import { CategoryState } from './Category/CategoryTypes';
import { ContactState } from './Contact/ContactTypes';
import { MailState } from './Mail/MailTypes';
import { NotifState } from './Notif/NotifTypes';
import { UserState } from './User/UserTypes';

export interface AppState {
  category: CategoryState;
  contact: ContactState;
  mail: MailState;
  notif: NotifState;
  user: UserState;
}

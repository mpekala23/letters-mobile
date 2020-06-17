import { UserState } from "./User/UserTypes";
import { NotifState } from "./Notif/NotifTypes";
import { ContactState } from "./Contact/ContactTypes";

export interface AppState {
  user: UserState;
  notif: NotifState;
  contact: ContactState;
}

import { ContactState } from "./Contact/ContactTypes";
import { LetterState } from "./Letter/LetterTypes";
import { NotifState } from "./Notif/NotifTypes";
import { UserState } from "./User/UserTypes";

export interface AppState {
  contact: ContactState;
  letter: LetterState;
  notif: NotifState;
  user: UserState;
}

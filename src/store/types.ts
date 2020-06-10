import { UserState } from "./User/UserTypes";
import { NotifState } from "./Notif/NotifTypes";

export interface AppState {
  user: UserState;
  notif: NotifState;
}

import { UserState } from "./User/UserTypes";
import { ContactState } from "./Contact/ContactTypes";

export interface AppState {
  user: UserState;
  contact: ContactState;
}

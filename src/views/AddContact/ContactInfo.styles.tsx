import { StyleSheet } from "react-native";
import { WINDOW_WIDTH } from "@utils";

export default StyleSheet.create({
  contactbackground: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  fullWidth: {
    width: "100%",
  },
  bottomButtonContainer: {
    marginTop: 30,
    marginBottom: 15,
    flexDirection: "row",
    width: WINDOW_WIDTH * 0.95,
  },
  bottomButton: {
    flex: 1,
    margin: 10,
  },
});

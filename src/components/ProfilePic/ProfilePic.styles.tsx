import { StyleSheet } from "react-native";
import { Colors } from "@styles";
import { withSafeAreaInsets } from "react-native-safe-area-context";

const userSize = 45;
const contactSize = 80;

export default StyleSheet.create({
  contactBackground: {
    alignItems: "center",
    justifyContent: "center",
    width: contactSize,
    height: contactSize,
    borderRadius: contactSize / 2,
    overflow: "hidden",
    backgroundColor: Colors.AMEELIO_ORANGE,
  },
  userBackground: {
    alignItems: "center",
    justifyContent: "center",
    width: userSize,
    height: userSize,
    borderRadius: userSize / 2,
    overflow: "hidden",
    backgroundColor: Colors.AMEELIO_ORANGE,
  },
  initials: {
    fontSize: 22,
    fontWeight: "500",
    color: "white",
  },
  contactPic: {
    width: contactSize,
    height: contactSize,
  },
  userPic: {
    width: userSize,
    height: userSize,
  },
});

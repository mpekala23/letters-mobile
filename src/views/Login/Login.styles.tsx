import { StyleSheet } from "react-native";
import { Colors } from "@styles";
import { AMEELIO_BLUE } from "styles/Colors";

export default StyleSheet.create({
  loginBackground: {
    flex: 1,
    padding: 10,
    paddingTop: 60,
    backgroundColor: "white",
  },
  avoidingBackground: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  fullWidth: {
    width: "100%",
  },
  forgotContainer: {
    backgroundColor: "white",
    marginBottom: 30,
  },
  forgotText: {
    color: Colors.AMEELIO_BLUE,
    fontSize: 16,
    fontWeight: "500",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
});

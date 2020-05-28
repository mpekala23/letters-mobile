import { StyleSheet } from "react-native";
import { Colors } from "@styles";

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: "white",
  },
  backgroundScroll: {
    flex: 1,
    margin: 10,
  },
  fullWidth: {
    width: "100%",
  },
  privacyBackground: {
    width: "100%",
    backgroundColor: Colors.AMEELIO_LIGHT_BLUE,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BEDAFC",
    borderRadius: 4,
    padding: 10,
    marginBottom: 30,
  },
  privacyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#124181",
  },
});

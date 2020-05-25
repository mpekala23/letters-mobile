import { StyleSheet } from "react-native";
import { Colors } from "@styles";

export default StyleSheet.create({
  buttonBackground: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: Colors.AMEELIO_BLUE,
    marginVertical: 5,
  },
  buttonBackgroundReverse: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.AMEELIO_BLUE,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    padding: 6,
  },
  buttonTextReverse: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.AMEELIO_BLUE,
    padding: 6,
  },
});

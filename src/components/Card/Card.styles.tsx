import { StyleSheet } from "react-native";
import { Colors } from "@styles";

export default StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardBase: {
    backgroundColor: "white",
    width: "100%",
    padding: 15,
    borderRadius: 6,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.AMEELIO_BLACK,
  },
  cardPrisonData: {
    fontSize: 18,
    color: Colors.AMEELIO_GRAY,
  },
});

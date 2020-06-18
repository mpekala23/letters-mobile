import { StyleSheet } from "react-native";
import { Colors } from "@styles";

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: "#EDEDED",
    flexDirection: "column",
  },
  profileCard: {
    backgroundColor: "white",
    height: 365,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    paddingTop: 48,
  },
  profileCardHeader: {
    backgroundColor: "#FC7272",
    height: 110,
    width: "100%",
    borderRadius: 10,
    position: "absolute",
    top: 16,
    left: 16,
  },
  sendLetterButton: {
    backgroundColor: "#FC7272",
    borderRadius: 15,
    width: "100%",
    height: 50,
  },
  profileCardInfo: {
    color: Colors.GRAY_DARKER,
    fontSize: 16,
    paddingBottom: 4,
  },
  actionItems: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: "white",
    borderRadius: 8,
    height: 100,
    paddingTop: 10,
    paddingLeft: 20,
  },
});

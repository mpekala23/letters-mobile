import { StyleSheet } from "react-native";

export default StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: "center",
  },
  question: { fontSize: 23, textAlign: "center" },
  textAreaBox: {
    width: "100%",
    height: "50%",
    backgroundColor: "#F6F6F6",
    borderRadius: 4,
    marginTop: 10,
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  textAreaText: {
    height: "100%",
    width: "100%",
    justifyContent: "flex-start",
  },
});

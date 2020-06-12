import { StyleSheet } from "react-native";

export default StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },
  profile: {
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: 40,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 6,
  },
  profileHeader: {
    backgroundColor: "#FFC9C9",
    width: "100%",
    height: "35%",
    borderRadius: 10,
    position: "absolute",
    left: 16,
    top: 16,
  },
  memoryLane: {
    backgroundColor: "white",
    height: 80,
    margin: 16,
    borderRadius: 5,
  },
  letter: {
    backgroundColor: "white",
    height: 100,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
    borderRadius: 5,
  }
});

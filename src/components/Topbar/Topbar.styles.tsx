import { StyleSheet } from "react-native";

const barHeight = 50;

export default StyleSheet.create({
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: barHeight,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  logoContainer: {
    flex: 1,
    height: barHeight,
  },
  logo: {
    height: barHeight + 5,
    aspectRatio: 2015 / 885,
    marginTop: -5,
  },
});

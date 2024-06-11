import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Colors from "../constants/colors";

function NavBar() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.textContainer}>
        <View style={styles.textBox}>
          <Text style={styles.text}>The Lab</Text>
        </View>
        <View style={styles.textBox}>
            <Text style={styles.text}>Menu</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default NavBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.EnergyGreen,
    height: 100,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  text: {
    color: Colors.DarkGray,
    fontSize: 20,
    fontWeight: "bold",
  }
});

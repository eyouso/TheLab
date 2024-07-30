import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import Colors from "../constants/colors";

function NavBar() {
  const route = useRoute();
  const routeName = route.name;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.textContainer}>
        <View style={styles.textBox}>
          <Text style={styles.text}>{routeName}</Text>
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
  },
});

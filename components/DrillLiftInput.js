import { View, Text, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import Colors from "../constants/colors";

function DrillLiftInput() {
  const [text, onChangeText] = useState("");

  function handleChange(event) {
    onChangeText(event.target.value);
  }

  return (
    <View style={styles.container}>
      <TextInput
        onChange={handleChange}
        value={text}
        autoCorrect={false}
        style={styles.inputContainer}
      />
      <View style={styles.addButton}>
        <Text>+</Text>
      </View>
    </View>
  );
}

export default DrillLiftInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    width: "100%",
    padding: 6,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: Colors.EnergyGreen,
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    marginLeft: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
    borderRadius: 5,
  },
});

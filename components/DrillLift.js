import { View, Text, TextInput, StyleSheet } from "react-native";

// Maximum Characters for Drill/Lift Name
const MAX_DRILL_LIFT_LENGTH = 50;

function DrillLift(props) {

  return (
      <TextInput
        placeholder="Add a New Drill or Lift"
        value={props.value}
        onChangeText={props.onChangeText}
        style={styles.container}
        autoCorrect={false}
        maxLength={MAX_DRILL_LIFT_LENGTH}
      />
  );
}

export default DrillLift;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    padding: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
    borderRadius: 8,
  },
});

import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

// Maximum Characters for Drill/Lift Name
const MAX_DRILL_LIFT_LENGTH = 50;

function DrillLiftInput(props) {
  return (
    <TextInput
      placeholder="Add a New Drill or Lift"
      value={props.value}
      onChangeText={props.onChangeText}
      style={styles.container}
      autoCorrect={false}
      maxLength={MAX_DRILL_LIFT_LENGTH}
      returnKeyType="done"
      onSubmitEditing={props.onSubmitEditing}
      blurOnSubmit={false}
    />
  );
}

export default DrillLiftInput;

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

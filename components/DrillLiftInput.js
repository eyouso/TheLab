import React, { useRef } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

// Maximum Characters for Drill/Lift Name
const MAX_DRILL_LIFT_LENGTH = 30;

function DrillLiftInput(props) {
  // Refs to manage focus between inputs
  const setsInputRef = useRef(null);
  const repsInputRef = useRef(null);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Add a new drill or lift"
        value={props.value}
        onChangeText={props.onChangeText}
        style={[styles.inputItemContainer, { flex: 4, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }]}
        autoCorrect={false}
        maxLength={MAX_DRILL_LIFT_LENGTH}
        returnKeyType="next"
        onSubmitEditing={() => setsInputRef.current.focus()}
        blurOnSubmit={false}
      />
      <View style={[styles.inputItemContainer, { flex: 1.5 }]}>
        <Text style={styles.label}>Sets:</Text>
        <TextInput
          ref={setsInputRef}
          value={props.sets}
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
            if (numericValue.length <= 2) {
              props.onSetsChange(numericValue);
            }
          }}
          style={styles.numberInput}
          keyboardType="numeric"
          maxLength={2}
          placeholder="X"
          returnKeyType="next"
          onSubmitEditing={() => repsInputRef.current.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={[styles.inputItemContainer, { flex: 1.5, borderTopRightRadius: 8, borderBottomRightRadius: 8 }]}>
        <Text style={styles.label}>Reps:</Text>
        <TextInput
          ref={repsInputRef}
          value={props.reps}
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
            if (numericValue.length <= 2) {
              props.onRepsChange(numericValue);
            }
          }}
          style={styles.numberInput}
          keyboardType="numeric"
          maxLength={2}
          placeholder="X"
          returnKeyType="done"
          onSubmitEditing={props.onSubmitEditing}
          blurOnSubmit={false}
        />
      </View>
    </View>
  );
}

export default DrillLiftInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
  },
  inputItemContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  numberInput: {
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: "white",
    textAlign: "center", // Center align text to make it look better for two digits
  },
  label: {
    fontWeight: "bold",
  },
});

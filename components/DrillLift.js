import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

function DrillLift(props) {
  return (
    <TouchableOpacity
      style={[styles.item, props.isActive && styles.activeItem]}
      onLongPress={props.onLongPress}
        delayLongPress={100}
    >
      <Text style={styles.itemText}>{props.value}</Text>
    </TouchableOpacity>
  );
}

export default DrillLift;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeItem: {
    backgroundColor: "#cce5ff",
  },
  itemText: {
    fontSize: 16,
  },
});

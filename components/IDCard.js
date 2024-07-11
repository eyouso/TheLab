import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors";

function IDCard(props) {
  return (
    <View style={styles.container}>
      {/* Will update these values from backend. Also need a way to edit them from frontend */}
      <Text style={styles.nameText}>{props.name}</Text>
      <Text style={styles.bodyText}>Class: {props.class}</Text>
      <Text style={styles.bodyText}>Team: {props.team}</Text>
      <Text style={styles.bodyText}>Position: {props.position}</Text>
      <Text style={styles.bodyText}>Height: {props.feet}'{props.inches}"</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    width: "95%",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bodyText: {
    fontSize: 16,
    marginVertical: 2,
  },
});

export default IDCard;

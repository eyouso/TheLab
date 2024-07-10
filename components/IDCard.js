import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors";

function IDCard() {
  return (
    <View style={styles.container}>
      {/* Will update these values from backend. Also need a way to edit them from frontend */}
      <Text style={styles.nameText}>Ethan Youso</Text>
      <Text style={styles.bodyText}>Year: Super Super Senior</Text>
      <Text style={styles.bodyText}>Team: St. John's Basketball</Text>
      <Text style={styles.bodyText}>Position: Point Guard</Text>
      <Text style={styles.bodyText}>Height: 6'7"</Text>
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

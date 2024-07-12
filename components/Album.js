import { View, Text, StyleSheet } from "react-native";

function Album(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    marginVertical: 10,
    padding: 5,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
  },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default Album;

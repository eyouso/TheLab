import { View, Text, StyleSheet, TextInput } from "react-native";

function Album(props) {
    if(props.title) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{props.title}</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <TextInput style={styles.title} placeholder="New Album"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    marginVertical: 10,
    marginHorizontal: 10,
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

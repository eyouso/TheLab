import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

function BottomBar() {
    return (
        <View style={styles.container}>
            <View style={styles.menuBox}>
                <Ionicons name = "person" size={48}/>
            </View>
            <View style={styles.menuBox}>
                <Ionicons name = "home" size={48}/>
            </View>
            <View style={styles.menuBox}>
                <Ionicons name = "library" size={48}/>
            </View>
        </View>
    );
}

export default BottomBar;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.DarkGray,
        height: 100,
        flexDirection: "row",
      },
    menuBox: {
        backgroundColor: Colors.EnergyGreen,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: Colors.DarkGray,
    }
});
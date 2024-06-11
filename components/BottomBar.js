import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors";

function BottomBar() {
    return (
        <View style={styles.container}>
            <View style={styles.menuBox}>
                <Text>Profile</Text>
            </View>
            <View style={styles.menuBox}>
                <Text>Home</Text>
            </View>
            <View style={styles.menuBox}>
                <Text>Settings</Text>
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
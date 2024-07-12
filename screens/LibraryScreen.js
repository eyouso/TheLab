import NavBar from "../components/NavBar";
import { View, Text, StyleSheet } from "react-native";
import Album from "../components/Album";
import PrimaryButton from "../components/PrimaryButton";

function LibraryScreen() {

    return (
        <View style={styles.screen}>
            <View>
                <NavBar />
            </View>
            <View style={styles.libraryContainer}>
                <Text style={styles.libraryTitleText}>My Library</Text>
                {/* Add Horizontal List of Album Components here */}
                {/* Example Album Component: */}
                <Album title="Album Title" />
            </View>
            <View style={styles.libraryContainer}>
                <Text style={styles.libraryTitleText}>Team Library</Text>
                {/* Add Horizontal List of Album Components here */}
            </View>
            <View style={styles.libraryContainer}>
                <Text style={styles.libraryTitleText}>Community Library</Text>
                {/* Add Horizontal List of Album Components here */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "white",
        flex: 1,
    },
    libraryContainer: {
        margin: 20,
        justifyContent: "center",
    },
    libraryTitleText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
});

export default LibraryScreen;
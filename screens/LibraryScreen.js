import NavBar from "../components/NavBar";
import BottomBar from "../components/BottomBar";
import { View, Text, StyleSheet } from "react-native";

function LibraryScreen() {

    return (
        <>
            <View>
                <NavBar />
            </View>
            <View>
                <Text>Library Screen</Text>
            </View>
        </>
    );
}

export default LibraryScreen;
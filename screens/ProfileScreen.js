import NavBar from "../components/NavBar";
import BottomBar from "../components/BottomBar";
import { View, Text, StyleSheet } from "react-native";

function ProfileScreen() {

    return (
        <>
            <View>
                <NavBar />
            </View>
            <View>
                <Text>Profile Screen</Text>
            </View>
        </>
    );
}

export default ProfileScreen;
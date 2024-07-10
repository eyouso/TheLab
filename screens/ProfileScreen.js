import NavBar from "../components/NavBar";
import { View, Text, StyleSheet } from "react-native";
import IDCard from "../components/IDCard";

function ProfileScreen() {

    return (
        <>
            <View>
                <NavBar />
            </View>
            <View>
                <IDCard />
            </View>
        </>
    );
}

export default ProfileScreen;
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import NavBar from "../components/NavBar";
import BottomBar from "../components/BottomBar";
import Workout from "../components/Workout";


function MainScreen() {
  return (
    <>
      <View>
        <NavBar />
      </View>
        <SafeAreaView style={styles.screen}>
          <Workout />
          <StatusBar style="auto" />
        </SafeAreaView>
      <View>
        <BottomBar />
      </View>
    </>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});

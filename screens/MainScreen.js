import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.screen}>
            <Workout />
            <StatusBar style="auto" />
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    backgroundColor: "white",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
});

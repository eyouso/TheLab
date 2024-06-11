import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import NavBar from './components/NavBar';
import MainScreen from './screens/MainScreen';

export default function App() {

  let screen= <MainScreen />;

  return (
    <View style={styles.rootScreen}>
      {screen}
    </View>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
});

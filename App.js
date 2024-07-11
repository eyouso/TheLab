import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import MainScreen from "./screens/MainScreen";
import ProfileScreen from "./screens/ProfileScreen"; // Create this screen
import LibraryScreen from "./screens/LibraryScreen"; // Create this screen
import BottomBar from "./components/BottomBar"; // Adjust the path as necessary

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Disable the header
        }}
        tabBar={(props) => <BottomBar {...props} />}
      >
        <Tab.Screen name="Home" component={MainScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Library" component={LibraryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
});

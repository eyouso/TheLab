import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import MainScreen from "./screens/MainScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LibraryScreen from "./screens/LibraryScreen";
import AlbumContentScreen from "./screens/AlbumContentScreen";
import DrillLiftDetailScreen from "./screens/DrillLiftDetailScreen"; // Adjust the path as necessary
import BottomBar from "./components/BottomBar"; // Adjust the path as necessary
import { DrillLiftProvider } from "./context/DrillLiftContext"; // Import the context provider

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="The Lab"
        component={MainScreen}
        options={{ headerTitle: 'The Lab', headerShown: false }}
      />
      <Stack.Screen name="DrillLiftDetail" component={DrillLiftDetailScreen} options={{ headerTitle: 'Details', headerShown: false }} />
      <Stack.Screen name="AlbumContent" component={AlbumContentScreen} options={{ headerTitle: 'Album Content', headerShown: false }} />
    </Stack.Navigator>
  );
}

function LibraryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Library"
        component={LibraryScreen}
        options={{ headerTitle: 'Library', headerShown: false }}
      />
      <Stack.Screen name="AlbumContent" component={AlbumContentScreen} options={{ headerTitle: 'Album Content', headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <DrillLiftProvider>
      <NavigationContainer>
        <View style={styles.rootScreen}>
          <Tab.Navigator
            screenOptions={{
              headerShown: false, // Disable the header
            }}
            tabBar={(props) => <BottomBar {...props} />}
          >
            <Tab.Screen name="Main" component={MainStack} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="LibraryScreen" component={LibraryStack} />
          </Tab.Navigator>
        </View>
      </NavigationContainer>
    </DrillLiftProvider>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
});

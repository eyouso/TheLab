import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import MainScreen from "./screens/MainScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LibraryScreen from "./screens/LibraryScreen";
import DrillLiftDetailScreen from "./screens/DrillLiftDetailScreen"; // Adjust the path as necessary
import BottomBar from "./components/BottomBar"; // Adjust the path as necessary

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
      <Stack.Screen name="DrillLiftDetail" component={DrillLiftDetailScreen} options={{headerTitle: 'Details', headerShown: false}}/>
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.rootScreen}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false, // Disable the header
          }}
          tabBar={(props) => <BottomBar {...props} />}
        >
          <Tab.Screen name="MainScreen" component={MainStack} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Library" component={LibraryScreen} />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
});

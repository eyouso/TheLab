import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import Colors from "../constants/colors";

function BottomBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuBox}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person" size={48} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuBox}
        onPress={() => navigation.navigate('The Lab')}
      >
        <Ionicons name="home" size={48} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuBox}
        onPress={() => navigation.navigate('Library')}
      >
        <Ionicons name="library" size={48} />
      </TouchableOpacity>
    </View>
  );
}

export default BottomBar;

const styles = StyleSheet.create({
  container: {
    height: 100,
    flexDirection: "row",
  },
  menuBox: {
    backgroundColor: Colors.EnergyGreen,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.DarkGray,
  },
});

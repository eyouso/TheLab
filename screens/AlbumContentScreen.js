// AlbumContentScreen.js
import React from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView, Button } from "react-native";
import Album from "../components/Album";
import Workout from "../components/Workout"; // Assuming you have a Workout component
import DrillLift from "../components/DrillLift"; // Assuming you have a DrillLift component

function AlbumContentScreen({ route, navigation }) {
  const { album } = route.params;

  const renderItem = ({ item }) => {
    if (item.type === "album") {
      return (
        <Album
          title={item.title}
          isEnlarged={false}
          onPress={() => {}}
        />
      );
    } else if (item.type === "workout") {
      return (
        <Workout
          title={item.title}
          // Add other necessary props for Workout
        />
      );
    } else if (item.type === "drillLift") {
      return (
        <DrillLift
          title={item.title}
          // Add other necessary props for DrillLift
        />
      );
    }
    return null;
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      console.log("Navigating back to previous screen");
      navigation.goBack();
    } else {
      console.log("No previous screen, staying on current screen");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Button title="Back" onPress={handleBackPress} />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>{album.title}</Text>
        <FlatList
          data={album.contents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
        />
      </View>
    </SafeAreaView>
  );
}

export default AlbumContentScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  contentContainer: {
    alignItems: "center",
  },
});

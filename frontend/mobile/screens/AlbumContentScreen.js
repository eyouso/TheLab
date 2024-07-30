import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView, Button, Modal, TouchableOpacity } from "react-native";

function AlbumContentScreen({ route, navigation }) {
  const { album } = route.params;
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log('Album contents:', album.contents);
    album.contents.forEach(item => {
      console.log('Workout ID:', item.id);
    });
  }, [album.contents]);

  const renderItem = ({ item }) => {
    console.log('Rendering item with ID:', item.id);
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          setSelectedWorkout(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.itemText}>{item.title}</Text>
      </TouchableOpacity>
    );
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Workout Options</Text>
          <Button title="Preview" onPress={() => {}} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
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
    textAlign: 'center',
  },
  contentContainer: {
    alignItems: "center",
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  itemText: {
    fontSize: 18,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0, height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  }
});

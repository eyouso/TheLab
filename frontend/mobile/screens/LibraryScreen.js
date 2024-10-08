import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  TextInput,
  Button,
} from "react-native";
import NavBar from "../components/NavBar";
import Album from "../components/Album";
import PrimaryButton from "../components/PrimaryButton";
import { fetchAlbums, addAlbum, deleteAlbum } from '../data/dataService'; // Import the new deleteAlbum function

function LibraryScreen({ navigation }) {
  const [myLibraryAlbums, setMyLibraryAlbums] = useState([]);
  const [teamLibraryAlbums, setTeamLibraryAlbums] = useState([]);
  const [communityLibraryAlbums, setCommunityLibraryAlbums] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const inputRef = useRef(null);
  const [enlargedAlbumId, setEnlargedAlbumId] = useState(null);

  useEffect(() => {
    const albums = fetchAlbums();
    setMyLibraryAlbums(albums.myLibraryAlbums);
    setTeamLibraryAlbums(albums.teamLibraryAlbums);
    setCommunityLibraryAlbums(albums.communityLibraryAlbums);
  }, []);

  useEffect(() => {
    if (modalVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalVisible]);

  const addNewAlbum = () => {
    if (newAlbumTitle.trim()) {
      const newAlbum = {
        title: newAlbumTitle,
        contents: [], // Initialize contents array
      };
      const addedAlbum = addAlbum(newAlbum);
      setMyLibraryAlbums(fetchAlbums().myLibraryAlbums); // Refresh the album list from the data service
      setNewAlbumTitle("");
      setModalVisible(false);
    }
  };

  const handleCancel = () => {
    setNewAlbumTitle("");
    setModalVisible(false);
  };

  const handleAlbumLongPress = (id) => {
    setEnlargedAlbumId(id);
  };

  const handleScreenPress = () => {
    setEnlargedAlbumId(null);
  };

  const handleDeletePress = (albumId) => {
    setAlbumToDelete(albumId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (deleteAlbum(albumToDelete)) {
      setMyLibraryAlbums((prevAlbums) => prevAlbums.filter((album) => album.id !== albumToDelete));
    }
    setDeleteModalVisible(false);
    setAlbumToDelete(null);
  };

  const handleAlbumPress = (album) => {
    console.log("Navigating to AlbumContentScreen with album:", album);
    navigation.navigate("AlbumContent", { album });
  };

  const renderItem =
    (setAlbums, expandable) =>
    ({ item }) => {
      if (item.type === "button") {
        return (
          <PrimaryButton
            style={styles.addButton}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            +
          </PrimaryButton>
        );
      }
      return (
        <Album
          title={item.title}
          isEnlarged={enlargedAlbumId === item.id}
          onPress={() => handleAlbumPress(item)}
          onLongPress={expandable ? () => handleAlbumLongPress(item.id) : null}
          onDelete={expandable ? () => handleDeletePress(item.id) : null}
          expandable={expandable}
        />
      );
    };

  const renderAlbumList = (albums, showAddButton, expandable) => {
    const data = showAddButton ? [...albums, { id: "add-button", type: "button" }] : albums;
    return (
      <FlatList
        horizontal
        data={data}
        renderItem={renderItem(setMyLibraryAlbums, expandable)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.albumList}
        showsHorizontalScrollIndicator={false} // Hide the horizontal scroll indicator
      />
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View style={styles.screen}>
        <View>
          <NavBar />
        </View>
        <View style={styles.libraryContainer}>
          <Text style={styles.libraryTitleText}>My Library</Text>
          {renderAlbumList(myLibraryAlbums, true, true)}
        </View>
        <View style={styles.libraryContainer}>
          <Text style={styles.libraryTitleText}>Team Library</Text>
          {renderAlbumList(teamLibraryAlbums, false, false)}
        </View>
        <View style={styles.libraryContainer}>
          <Text style={styles.libraryTitleText}>Community Library</Text>
          {renderAlbumList(communityLibraryAlbums, false, false)}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCancel}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter a name for this album</Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Album Name"
              value={newAlbumTitle}
              onChangeText={setNewAlbumTitle}
              maxLength={30} // Set your desired character limit here
            />
            <Button title="Confirm" onPress={addNewAlbum} />
            <Button title="Cancel" onPress={handleCancel} />
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to delete this album?</Text>
            <Button title="Delete" onPress={confirmDelete} />
            <Button title="Cancel" onPress={() => setDeleteModalVisible(false)} />
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
    flex: 1,
  },
  libraryContainer: {
    margin: 20,
    justifyContent: "center",
    position: 'relative',
  },
  libraryTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  albumList: {
    alignItems: "center",
  },
  addButton: {
    alignSelf: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    bottom: '50%', // Adjust this value to lower the modal
    left: '10%',
    right: '10%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '80%',
  },
});

export default LibraryScreen;

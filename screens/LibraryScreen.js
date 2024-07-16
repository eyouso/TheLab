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

function LibraryScreen() {
  const [myLibraryAlbums, setMyLibraryAlbums] = useState([]);
  const [teamLibraryAlbums, setTeamLibraryAlbums] = useState([]);
  const [communityLibraryAlbums, setCommunityLibraryAlbums] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [currentSetAlbums, setCurrentSetAlbums] = useState(() => {});
  const inputRef = useRef(null);

  useEffect(() => {
    if (modalVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalVisible]);

  const addAlbum = () => {
    if (newAlbumTitle.trim()) {
      const newAlbum = {
        id: String(Math.random()),
        type: "album",
        title: newAlbumTitle,
      };
      currentSetAlbums((prevAlbums) => [
        ...prevAlbums,
        newAlbum,
      ]);
      setNewAlbumTitle("");
      setModalVisible(false);
    }
  };

  const handleCancel = () => {
    setNewAlbumTitle("");
    setModalVisible(false);
  };

  const renderItem =
    (setAlbums) =>
    ({ item }) => {
      if (item.type === "button") {
        return (
          <PrimaryButton
            style={styles.addButton}
            onPress={() => {
              setCurrentSetAlbums(() => setAlbums);
              setModalVisible(true);
            }}
          >
            +
          </PrimaryButton>
        );
      }
      return <Album title={item.title} />;
    };

  const renderAlbumList = (albums, setAlbums, showAddButton) => {
    const data = showAddButton ? [...albums, { id: "add-button", type: "button" }] : albums;
    return (
      <FlatList
        horizontal
        data={data}
        renderItem={renderItem(setAlbums)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.albumList}
        showsHorizontalScrollIndicator={false}
      />
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        <View>
          <NavBar />
        </View>
        <View style={styles.libraryContainer}>
          <Text style={styles.libraryTitleText}>My Library</Text>
          {renderAlbumList(myLibraryAlbums, setMyLibraryAlbums, true)}
        </View>
        <View style={styles.libraryContainer}>
          <Text style={styles.libraryTitleText}>Team Library</Text>
          {renderAlbumList(teamLibraryAlbums, setTeamLibraryAlbums, false)}
        </View>
        <View style={styles.libraryContainer}>
          <Text style={styles.libraryTitleText}>Community Library</Text>
          {renderAlbumList(communityLibraryAlbums, setCommunityLibraryAlbums, false)}
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
            <Button title="Confirm" onPress={addAlbum} />
            <Button title="Cancel" onPress={handleCancel} />
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
  },
  libraryTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  albumList: {
    flexGrow: 1,  // Allow the list to grow and be scrollable
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
      width: 0,
      height: 2,
    },
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

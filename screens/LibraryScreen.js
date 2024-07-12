import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import NavBar from "../components/NavBar";
import Album from "../components/Album";
import PrimaryButton from "../components/PrimaryButton";

function LibraryScreen() {
  const [myLibraryAlbums, setMyLibraryAlbums] = useState([{ id: 'add-button', type: 'button' }]);
  const [teamLibraryAlbums, setTeamLibraryAlbums] = useState([{ id: 'add-button', type: 'button' }]);
  const [communityLibraryAlbums, setCommunityLibraryAlbums] = useState([{ id: 'add-button', type: 'button' }]);

  const addAlbum = (setAlbums) => {
    const newAlbum = { id: String(Math.random()), type: 'album', title: "New Album" };
    setAlbums(prevAlbums => [...prevAlbums.slice(0, -1), newAlbum, { id: 'add-button', type: 'button' }]);
  };

  const renderItem = (setAlbums) => ({ item }) => {
    if (item.type === 'button') {
      return (
        <PrimaryButton style={styles.addButton} onPress={() => addAlbum(setAlbums)}>
          +
        </PrimaryButton>
      );
    }
    return <Album title={item.title} />;
  };

  return (
    <View style={styles.screen}>
      <View>
        <NavBar />
      </View>
      <View style={styles.libraryContainer}>
        <Text style={styles.libraryTitleText}>My Library</Text>
        <FlatList
          horizontal
          data={myLibraryAlbums}
          renderItem={renderItem(setMyLibraryAlbums)}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.albumList}
        />
      </View>
      <View style={styles.libraryContainer}>
        <Text style={styles.libraryTitleText}>Team Library</Text>
        <FlatList
          horizontal
          data={teamLibraryAlbums}
          renderItem={renderItem(setTeamLibraryAlbums)}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.albumList}
        />
      </View>
      <View style={styles.libraryContainer}>
        <Text style={styles.libraryTitleText}>Community Library</Text>
        <FlatList
          horizontal
          data={communityLibraryAlbums}
          renderItem={renderItem(setCommunityLibraryAlbums)}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.albumList}
        />
      </View>
    </View>
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
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  albumList: {
    flexGrow: 0,
    alignItems: "center",
  },
  addButton: {
    alignSelf: "center",
  },
});

export default LibraryScreen;

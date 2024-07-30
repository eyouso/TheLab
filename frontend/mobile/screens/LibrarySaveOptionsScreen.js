import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Album from '../components/Album';
import { fetchAlbums, addWorkoutToAlbum } from '../data/dataService'; // Import necessary functions
import Colors from '../constants/colors';

function LibrarySaveOptionsScreen({ route }) {
  const { workout } = route.params;
  const [myLibraryAlbums, setMyLibraryAlbums] = useState([]);
  const [teamLibraryAlbums, setTeamLibraryAlbums] = useState([]);
  const [communityLibraryAlbums, setCommunityLibraryAlbums] = useState([]);
  const [overwriteVisible, setOverwriteVisible] = useState(false);
  const [albumToSave, setAlbumToSave] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const albums = fetchAlbums();
    setMyLibraryAlbums(albums.myLibraryAlbums);
    setTeamLibraryAlbums(albums.teamLibraryAlbums);
    setCommunityLibraryAlbums(albums.communityLibraryAlbums);
  }, []);

  const handleSave = (albumId) => {
    console.log('Attempting to save workout to album:', albumId);
    console.log('Workout to save:', workout);
    const result = addWorkoutToAlbum(albumId, workout);
    console.log('Result of addWorkoutToAlbum:', result);
    if (!result) {
      setAlbumToSave(albumId);
      setOverwriteVisible(true);
    } else {
      console.log('Workout saved successfully');
      navigation.goBack();
    }
  };

  const confirmOverwrite = () => {
    console.log('Overwriting workout in album:', albumToSave);
    addWorkoutToAlbum(albumToSave, workout, true);
    setOverwriteVisible(false);
    navigation.goBack();
  };

  const renderAlbum = ({ item }) => {
    console.log('Rendering album:', item.title);
    return (
      <Album
        title={item.title}
        isEnlarged={false}
        onPress={() => {
          console.log('Album pressed:', item.id);
          handleSave(item.id);
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cancelButtonContainer}>
        <Button title="Cancel" onPress={() => navigation.goBack()} style={styles.cancelButton} />
      </View>
      <View style={styles.screen}>
        <View style={styles.libraryContainer}>
          <Text style={styles.libraryTitleText}>My Library</Text>
          <FlatList
            horizontal
            data={myLibraryAlbums}
            renderItem={renderAlbum}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.albumList}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.libraryContainer}>
          <Text style={styles.libraryTitleText}>Team Library</Text>
          <FlatList
            horizontal
            data={teamLibraryAlbums}
            renderItem={({ item }) =>
              <View style={styles.disabledContainer}>
                <Album title={item.title} isEnlarged={false} />
              </View>
            }
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.albumList}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.libraryContainer}>
          <Text style={styles.libraryTitleText}>Community Library</Text>
          <FlatList
            horizontal
            data={communityLibraryAlbums}
            renderItem={({ item }) =>
              <View style={styles.disabledContainer}>
                <Album title={item.title} isEnlarged={false} />
              </View>
            }
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.albumList}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={overwriteVisible}
          onRequestClose={() => setOverwriteVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
              <Text style={styles.modalText}>
                A workout with the same name already exists. Would you like to overwrite it?
              </Text>
              <Button title="Overwrite" onPress={confirmOverwrite} />
              <Button title="Cancel" onPress={() => setOverwriteVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  cancelButtonContainer: {
    alignItems: 'flex-start',
    padding: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  libraryContainer: {
    margin: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  libraryTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  albumList: {
    alignItems: 'center',
  },
  albumContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledContainer: {
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default LibrarySaveOptionsScreen;

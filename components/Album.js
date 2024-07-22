import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard } from "react-native";
import Feather from 'react-native-vector-icons/Feather';

const MAX_TITLE_LENGTH = 30; // Set your desired character limit here

function Album(props) {
  const [title, setTitle] = useState(props.title || "");
  const [isEditable, setIsEditable] = useState(!props.title || props.isEnlarged);

  const handleBlur = () => {
    if (title.trim()) {
      setIsEditable(false);
    }
  };

  const handleSubmitEditing = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.container, props.isEnlarged && styles.enlarged]}
        onLongPress={props.expandable ? props.onLongPress : null}
        delayLongPress={500}
        activeOpacity={1}
      >
        {props.isEnlarged ? (
          <TextInput
            style={[styles.title, props.isEnlarged && styles.enlargedTitle]}
            placeholder="New Album"
            value={title}
            onChangeText={(text) => {
              if (text.length <= MAX_TITLE_LENGTH) {
                setTitle(text);
              }
            }}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmitEditing}
            editable={props.isEnlarged}
            autoFocus={props.isEnlarged}
            maxLength={MAX_TITLE_LENGTH}
            returnKeyType="done"
            blurOnSubmit
            multiline
          />
        ) : (
          <Text
            style={[styles.title, props.isEnlarged && styles.enlargedTitle]}
            numberOfLines={4}
            ellipsizeMode="tail"
            selectable={false} // Make text not highlightable
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
      {props.isEnlarged && (
        <TouchableOpacity onPress={props.onDelete} style={styles.deleteButton}>
          <Feather
            name="x"
            size={16}
            color="white"
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  container: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
  },
  enlarged: {
    height: 120,
    width: 120,
    zIndex: 1, // Ensure the enlarged album is above other elements
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: '100%', // Ensure the text wraps within the container
  },
  enlargedTitle: {
    fontSize: 20,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  deleteIcon: {
    textAlign: 'center',
  },
});

export default Album;

import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard } from "react-native";

const MAX_TITLE_LENGTH = 30; // Set your desired character limit here

function Album(props) {
  const [title, setTitle] = useState(props.title || "");
  const [isEditable, setIsEditable] = useState(!props.title);

  const handleBlur = () => {
    if (title.trim()) {
      setIsEditable(false);
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
      {isEditable ? (
        <TextInput
          style={styles.title}
          placeholder="New Album"
          value={title}
          onChangeText={(text) => {
            if (text.length <= MAX_TITLE_LENGTH) {
              setTitle(text);
            }
          }}
          onBlur={handleBlur}
          onSubmitEditing={handleBlur}
          autoFocus
          maxLength={MAX_TITLE_LENGTH}
          multiline
        />
      ) : (
        <Text style={styles.title} numberOfLines={4} ellipsizeMode="tail">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: '100%', // Ensure the text wraps within the container
  },
});

export default Album;

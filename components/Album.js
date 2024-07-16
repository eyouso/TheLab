import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

const MAX_TITLE_LENGTH = 30; // Set your desired character limit here

function Album(props) {
  const [title, setTitle] = useState(props.title || "");
  const [isEditable, setIsEditable] = useState(!props.title);

  const handleBlur = () => {
    if (title.trim()) {
      setIsEditable(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, props.isEnlarged && styles.enlarged]}
      onLongPress={props.onLongPress}
      delayLongPress={500}
      activeOpacity={1}
    >
      {isEditable ? (
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
          onSubmitEditing={handleBlur}
          autoFocus
          maxLength={MAX_TITLE_LENGTH}
          multiline
        />
      ) : (
        <Text style={[styles.title, props.isEnlarged && styles.enlargedTitle]} numberOfLines={4} ellipsizeMode="tail">
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
  enlarged: {
    height: 120,
    width: 120,
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
});

export default Album;

import { View, Text, Pressable, StyleSheet } from "react-native";
import Colors from "../constants/colors";

function PrimaryButton({ children, onPress }) {
  return (
    <View Style={styles.buttonOuterContainer}>
      <Pressable style={({pressed}) => pressed ? [styles.buttonInnerContainer, styles.pressed]: styles.buttonInnerContainer} onPress={onPress}>
        <Text Style={styles.buttonText} android_ripple={{ color: "#640233" }}>
          {children}
        </Text>
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    margin: 4,
    overflow: "hidden",
  },
  buttonInnerContainer: {
    backgroundColor: Colors.EnergyGreen,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 6,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});


   
    
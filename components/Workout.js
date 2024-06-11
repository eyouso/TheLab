import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";
import Colors from "../constants/colors";
import DrillLiftInput from "./DrillLiftInput";
import { useState } from "react";

function Workout() {

    const [workoutTitle, setWorkoutTitle] = useState("New Workout");

    function onChangeHandler(event) {
        setWorkoutTitle(event.target.value);
    }

    return(
    <View style={styles.container}>
        <TextInput style={styles.workoutTitleText} onChange={onChangeHandler}>{workoutTitle}</TextInput>
        <DrillLiftInput />
    </View>
    );
}

export default Workout;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.SecondaryBlue,
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.25,
    },
    workoutTitleText: {
        color: Colors.DarkGray,
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
    }

});
import {View, Text, TextInput, StyleSheet} from "react-native";
import Colors from "../constants/colors";

function GoalCard(props) {

    const goal = props.goal;
    const goalTitle = props.goalTitle;
    const goalDescription = props.goalDescription;

    if (goal === "teamGoal") {

    return (
        <View style={[styles.container, 
            {backgroundColor: Colors.SecondaryBlue}
        ]}>
            <Text style={styles.goalTitle}>{goalTitle}</Text>
            <Text style={styles.goalDescription}>{goalDescription}</Text>
        </View>
    );
} else {
    return (
        <View style={[styles.container, 
            {backgroundColor: Colors.EnergyGreen}
        ]}>
            <TextInput style={styles.goalTitle} placeholder="Goal Titile"/>
            <TextInput style={styles.goalDescription} placeholder="Goal Description"/>
        </View>
    );
}
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        width: "95%",
        margin: 10,
        padding: 10,
        borderRadius: 10,
        shadowColor: "black",
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 6,
        shadowOpacity: 0.25,
    },
    goalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    goalDescription: {
        fontSize: 16,
        marginVertical: 2,
    },
});

export default GoalCard;
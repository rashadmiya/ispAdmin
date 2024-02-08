import React ,{Component}from "react";
import {
  StyleSheet,
  View, ActivityIndicator 
} from "react-native";


export default class Loader extends Component {
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator  size="large" color="#000"/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.7,
        justifyContent: "center",
        alignItems: "center",
    }
});
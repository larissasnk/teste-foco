import React from "react";
import {TouchableOpacity, Text, StyleSheet} from "react-native";

export default function Button({title, onPress}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#244282",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: "75%",
    height: 50,
    marginBottom: 17,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 4}, 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    elevation: 5 
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});

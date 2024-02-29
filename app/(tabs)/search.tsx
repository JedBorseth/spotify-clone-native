import { StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useState } from "react";
import Colors from "@/constants/Colors";

export default function TabTwoScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={styles.container}>
      <Searchbar
        theme={{
          colors: {
            primary: Colors.green.text,
            outline: Colors.green.text,
          },
          dark: true,
        }}
        style={styles.searchbar}
        placeholder="Search..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        mode="view"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  searchbar: {
    width: "100%",
    backgroundColor: "",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

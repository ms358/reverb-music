import { Button, Text, View } from "react-native";
import { router, Router } from "expo-router";
import SongList from "./SongList";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Go to Song List" onPress={() => { router.push("/SongList") }} />
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

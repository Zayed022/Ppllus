import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function MessageInput({ onSend }: any) {
  const [text, setText] = useState("");
  const [media, setMedia] = useState<any>(null);

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
    });

    if (!result.canceled) {
      setMedia(result.assets[0]);
    }
  };

  const send = () => {
    if (!text.trim() && !media) return;

    onSend({ text, media });

    setText("");
    setMedia(null);
  };

  return (
    <View style={styles.wrapper}>

      {media && (
        <Image
          source={{ uri: media.uri }}
          style={styles.preview}
        />
      )}

      <View style={styles.container}>
        <Pressable onPress={pickMedia}>
          <Ionicons name="image-outline" size={24} />
        </Pressable>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message..."
          style={styles.input}
        />

        <Pressable onPress={send}>
          <Text style={styles.send}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  preview: {
    width: 80,
    height: 80,
    margin: 10,
    borderRadius: 10,
  },
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    marginHorizontal: 10,
  },
  send: {
    color: "#3797f0",
    fontWeight: "600",
  },
});

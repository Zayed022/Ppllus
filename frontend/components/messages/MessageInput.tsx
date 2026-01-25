import {
    View,
    TextInput,
    Pressable,
    Text,
    StyleSheet,
  } from "react-native";
  import { useState } from "react";
  
  export default function MessageInput({ onSend }: any) {
    const [text, setText] = useState("");
  
    const send = () => {
      if (!text.trim()) return;
      onSend(text);
      setText("");
    };
  
    return (
      <View style={styles.container}>
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
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      padding: 10,
      borderTopWidth: 1,
      borderColor: "#eee",
      alignItems: "center",
    },
    input: {
      flex: 1,
      padding: 10,
      backgroundColor: "#f2f2f2",
      borderRadius: 20,
      marginRight: 10,
    },
    send: {
      color: "#3797f0",
      fontWeight: "600",
    },
  });
  
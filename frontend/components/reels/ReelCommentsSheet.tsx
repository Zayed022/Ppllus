import BottomSheet from "@gorhom/bottom-sheet";
import {
  View,
  FlatList,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getReelComments,
  addReelComment,
} from "@/services/reel.api";

export default function ReelCommentsSheet({
  reelId,
  onNewComment,
}: {
  reelId: string;
  onNewComment?: () => void;
}) {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "90%"], []);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getReelComments(reelId);
    setComments(data);
  };

  const submit = async () => {
    if (!text.trim()) return;

    const optimistic = {
      _id: Date.now().toString(),
      text,
      user: {
        username: "You",
        profileImage: "",
      },
    };

    setComments(prev => [optimistic, ...prev]);
    setText("");
    onNewComment?.();

    try {
      await addReelComment(reelId, text);
      load();
    } catch {}
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <FlatList
        data={comments}
        keyExtractor={item => item._id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image
              source={{ uri: item.user.profileImage }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.username}>
                {item.user.username}
              </Text>
              <Text>{item.text}</Text>
            </View>
          </View>
        )}
      />

      {/* INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Add a comment…"
          style={styles.input}
        />
        <Pressable onPress={submit}>
          <Text style={styles.post}>Post</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 14,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  username: {
    fontWeight: "600",
    marginBottom: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  post: {
    color: "#0095f6",
    fontWeight: "600",
    marginLeft: 12,
  },
});

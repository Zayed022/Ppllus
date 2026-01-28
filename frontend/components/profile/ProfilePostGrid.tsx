// components/profile/ProfilePostsGrid.tsx
import { Image, Pressable, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const size = Dimensions.get("window").width / 3;

export default function ProfilePostsGrid({ post }: any) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/post/${post._id}`)}
    >
      <Image
        source={{ uri: post.media[0].url }}
        style={styles.image}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: size,
    height: size,
  },
});

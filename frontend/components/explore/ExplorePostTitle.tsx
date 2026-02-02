import { Pressable, Image } from "react-native";
import { useRouter } from "expo-router";

export default function ExplorePostTile({ post, size }: any) {
  const router = useRouter();

  const media = post.media?.[0];

  return (
    <Pressable
      onPress={() =>
        router.push(`/post/${post._id}`)
      }
    >
      <Image
        source={{ uri: media.url }}
        style={{
          width: size,
          height: size,
        }}
      />
    </Pressable>
  );
}

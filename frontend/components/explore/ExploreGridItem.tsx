import { Pressable, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const SIZE = width / 3;

export default function ExploreGridItem({ item }: any) {
  const router = useRouter();

  const uri =
    item.type === "POST"
      ? item.data.media[0]?.url
      : item.data.thumbnailUrl;

  const onPress = () => {
    if (item.type === "POST") {
      router.push(`/post/${item.data._id}`);
    } else {
      router.push(`/reels/${item.data._id}`);
    }
  };

  return (
    <Pressable onPress={onPress}>
      <Image
        source={{ uri }}
        style={{
          width: SIZE,
          height: SIZE,
          borderWidth: 0.5,
          borderColor: "#fff",
        }}
      />
    </Pressable>
  );
}

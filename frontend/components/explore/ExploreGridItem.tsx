import { Pressable, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const SIZE = width / 3;

export default function ExploreGridItem({ item }: any) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push(`/reels/${item._id}`)
      }
    >
      <Image
        source={{ uri: item.thumbnail }}
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

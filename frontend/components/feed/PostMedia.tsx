import { FlatList, Image, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function PostMedia({ media }: { media: any[] }) {
  return (
    <FlatList
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      data={media}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item.url }}
          style={{ width, height: width }}
          resizeMode="cover"
        />
      )}
    />
  );
}

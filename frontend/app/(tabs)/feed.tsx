import { View, StyleSheet } from "react-native";
import HomeHeader from "@/components/HomeHeader";
import StoriesRow from "@/components/StoriesRow";
import HomeFeed from "@/components/home/HomeFeed";

export default function Feed() {
  return (
    <View style={styles.container}>
      <HomeHeader />
      <StoriesRow />
      <HomeFeed />
      
      {/* Feed posts will come next */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

import { View, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";

interface Props {
  total: number;
  current: number;
  paused?: boolean;
}

export default function StoryProgress({
  total,
  current,
  paused = false,
}: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);

    if (paused) return;

    Animated.timing(progress, {
      toValue: 1,
      duration: 5000, // synced with IMAGE_DURATION
      useNativeDriver: false,
    }).start();
  }, [current, paused]);

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => {
        if (i < current) {
          return <View key={i} style={[styles.bar, styles.filled]} />;
        }

        if (i === current) {
          return (
            <View key={i} style={styles.bar}>
              <Animated.View
                style={[
                  styles.fill,
                  {
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          );
        }

        return <View key={i} style={styles.bar} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    flexDirection: "row",
    gap: 4,
    zIndex: 10,
  },
  bar: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#fff",
  },
  filled: {
    backgroundColor: "#fff",
  },
});

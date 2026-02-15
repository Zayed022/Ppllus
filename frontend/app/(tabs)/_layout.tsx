import { Tabs } from "expo-router";
import { View } from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          borderTopColor: "#e5e5e5",
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="home"
              size={26}
              color="#000"
              style={{ opacity: focused ? 1 : 0.7 }}
            />
          ),
        }}
      />

      {/* Reels */}
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="play"
              size={26}
              color="#000"
              style={{ opacity: focused ? 1 : 0.7 }}
            />
          ),
        }}
      />

    {/* Create */}
<Tabs.Screen
  name="create"
  options={{
    tabBarIcon: () => (
      <Feather name="map-pin" size={30} color="#000" />
    ),
  }}
/>


      {/* Activity */}
      <Tabs.Screen
        name="activity"
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Feather
                name="heart"
                size={26}
                color="#000"
                style={{ opacity: focused ? 1 : 0.7 }}
              />
              <View
                style={{
                  position: "absolute",
                  right: -2,
                  top: -2,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "red",
                }}
              />
            </View>
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="user"
              size={26}
              color="#000"
              style={{ opacity: focused ? 1 : 0.7 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

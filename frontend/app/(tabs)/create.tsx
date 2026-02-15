import { useEffect, useState, useRef, useCallback } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { fetchNearbyShops } from "@/services/shop.api";
import { getMarkerColor } from "@/utils/shopMarkers";

export default function ShopsMapScreen() {
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<any>(null);
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Debounce timer
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setLoading(false);
      return;
    }

    const location =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

    const initialRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setRegion(initialRegion);
    fetchShops(initialRegion);
  };

  const fetchShops = async (region: any) => {
    try {
      const data = await fetchNearbyShops({
        latitude: region.latitude,
        longitude: region.longitude,
        radius: 500,
      });

      setShops(data);
    } catch (err) {
      console.log("Shop fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Dynamic fetch when map moves (debounced)
  const onRegionChangeComplete = useCallback(
    (newRegion: any) => {
      setRegion(newRegion);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        fetchShops(newRegion);
      }, 500);
    },
    []
  );

  if (!region || loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFillObject}
      initialRegion={region}
      onRegionChangeComplete={onRegionChangeComplete}
      showsUserLocation
      showsMyLocationButton
      loadingEnabled
    >
      {shops.map((shop) => (
        <Marker
          key={shop._id}
          coordinate={{
            latitude: shop.location.coordinates[1],
            longitude: shop.location.coordinates[0],
          }}
          pinColor={getMarkerColor(shop.category)}
          title={shop.name}
          description={shop.address}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

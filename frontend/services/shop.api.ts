 // your existing axios instance

import api from "./api";

export const fetchNearbyShops = async ({
  latitude,
  longitude,
  radius = 500,
}: {
  latitude: number;
  longitude: number;
  radius?: number;
}) => {
  const res = await api.get("/shop/nearby", {
    params: {
      lat: latitude,
      lng: longitude,
      radius,
      limit: 100,
    },
  });

  return res.data;
};

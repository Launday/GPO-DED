import { useEffect } from "react";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

function ScrollZoom({ map, geojson }) {
  useEffect(() => {
    if (!map || !geojson || geojson.length === 0) return;

    // Создаем объект Set для хранения уникальных координат
    const uniqueCoords = new Set();

    const markerIcon = new L.Icon({
      iconUrl: markerIconPng,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    const markerLayer = L.geoJSON(geojson, {
      pointToLayer: function (feature, latlng) {
        return L.marker([latlng.lng, latlng.lat], {
          icon: markerIcon,
        }).bindPopup(feature.properties.name);
      },
    });
    markerLayer.addTo(map);

    // Добавляем обработчик событий moveend
    map.on("moveend", async () => {
      const bounds = map.getBounds();
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();
      const newBounds = L.latLngBounds(
        L.latLng(northEast.lat, southWest.lng),
        L.latLng(southWest.lat, northEast.lng)
      );
      const response = await fetch(
        "http://127.0.0.1:8000/markers/markers/geojson?bounds=${newBounds}"
      );
      const newGeojson = await response.json();
      markerLayer.clearLayers();
      markerLayer.addData(newGeojson);
    });

    return () => {
      map.off("moveend");
    };
  }, [map, geojson]);

  return null;
}

export default ScrollZoom;

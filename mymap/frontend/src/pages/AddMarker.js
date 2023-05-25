import { useEffect, useRef } from "react";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import "leaflet-easybutton";
import axios from "axios";

function SaveGeoJSON(feature) {
  axios
    .post("http://127.0.0.1:8000/markers/create/", feature)
    .then((response) => {
      console.log("Marker created:", response.data);
    })
    .catch((error) => {
      console.error("Error creating marker:", error);
    });
}

const addMarker = (feature, map, geojsonRef) => {
  const markerIcon = new L.Icon({
    iconUrl: markerIconPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  const marker = L.marker(feature.geometry.coordinates, {
    title: "Resource Location",
    alt: "Resource Location",
    riseOnHover: true,
    draggable: true,
    icon: markerIcon,
  });

  const popupContent = document.createElement("div");
  const popupTextarea = document.createElement("textarea");
  popupTextarea.className = "marker-popup-textarea";
  popupTextarea.value = feature.properties.name || "";
  popupTextarea.onblur = () => {
    geojsonRef.current = {
      ...geojsonRef.current,
      features: geojsonRef.current.features.map((f) => {
        if (feature.properties.id === feature.properties.id) {
          feature.properties.name = popupTextarea.value;
        }
        return f;
      }),
    };
  };

  const btnDelete = document.createElement("button");
  btnDelete.textContent = "Delete this marker";
  btnDelete.className = "marker-delete-button";

  btnDelete.onclick = () => {
    const id = feature.properties.id;
    geojsonRef.current = {
      ...geojsonRef.current,
      features: geojsonRef.current.features.filter(
        (feature) => feature.properties.id !== id
      ),
    };
    map.removeLayer(marker);
  };
  const btnCreate = document.createElement("button");
  btnCreate.textContent = "Create this marker";
  btnCreate.className = "marker-create-button";
  btnCreate.onclick = () => {
    feature.properties.name = popupTextarea.value;
    geojsonRef.current = {
      ...geojsonRef.current,
      features: geojsonRef.current.features.map((f) => {
        if (feature.properties.leaflet_id === f.properties.leaflet_id) {
          return feature;
        }
        return f;
      }),
    };
    SaveGeoJSON(feature);
  };
  popupContent.append(popupTextarea);
  popupContent.append(btnCreate);
  popupContent.append(btnDelete);

  marker.bindPopup(popupContent).openPopup();
  marker.addTo(map);
};

function AddMarker({ map }) {
  const geojsonRef = useRef({
    type: "FeatureCollection",
    features: [],
  });

  const HandleMapClick = (e) => {
    const geojsonFeature = {
      id: L.stamp(new Date()),
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [e.latlng.lat, e.latlng.lng],
      },

      properties: {
        name: "",
      },
    };
    const feature = geojsonFeature;
    addMarker(feature, map, geojsonRef);

    const newFeatures = geojsonRef.current.features.concat(geojsonFeature);
    geojsonRef.current = { ...geojsonRef.current, features: newFeatures };
  };

  useEffect(() => {
    if (!map) return;

    map.on("click", HandleMapClick);

    return () => {
      map.off("click", HandleMapClick);
    };
  }, [map]);

  return null;
}

export default AddMarker;

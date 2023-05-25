import "./App.css";
import { React, useState, useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-easybutton/src/easy-button.js";
import "leaflet-easybutton/src/easy-button.css";
import "font-awesome/css/font-awesome.min.css";
import LocationMarker from "./pages/LocationMarker";
import ScrollZoom from "./pages/ScrollZoom";
import AddMarker from "./pages/AddMarker";
// import saveGeoJSON from "./pages/zalupa";
import axios from "axios";

const { BaseLayer } = LayersControl;

function Map() {
  const [map, handleMapCreated] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/markers/markers/")
      .then((response) => {
        setMarkers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <MapContainer
      center={{ lat: 51.505, lng: -0.09 }}
      zoom={13}
      zoomControl={true}
      ref={handleMapCreated}
    >
      {markers && <GeoJSON data={markers} />}
      <LayersControl>
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png "
          />
        </BaseLayer>
      </LayersControl>
      <ScrollZoom map={map} geojson={markers} />
      <AddMarker map={map} />
      <LocationMarker map={map} />
    </MapContainer>
  );
}

export default Map;

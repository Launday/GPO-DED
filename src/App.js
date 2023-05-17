import './App.css';
import { React,useState,useEffect } from 'react';
import { MapContainer, TileLayer,LayersControl, GeoJSON} from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-easybutton/src/easy-button.js";
import "leaflet-easybutton/src/easy-button.css";
import "font-awesome/css/font-awesome.min.css";
import LocationMarker from "./pages/LocationMarker"
import ScrollZoom from "./pages/ScrollZoom"
import AddMarker from './pages/AddMarker';

const { BaseLayer } = LayersControl;

function Map() 
{ 
  const [map, handleMapCreated] = useState(null); 
  const [geojson, setGeojson] = useState(); 
 
  useEffect(() => { 
    fetch("geojson.json") 
      .then((r) => r.json()) 
      .then((r) => setGeojson(r)); 
  }, []); 
 
  return( 
  <MapContainer 
            center={{ lat: 51.505, lng: -0.09 }} 
            zoom={13} 
            zoomControl={true} 
            ref={handleMapCreated}> 
      {geojson && <GeoJSON data={geojson} />} 
      <LayersControl> 
        <BaseLayer checked name="OpenStreetMap"> 
          <TileLayer 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png " 
          /> 
        </BaseLayer> 
      </LayersControl> 
      <AddMarker map = {map} geojson={geojson} setGeojson={setGeojson}/> 
      <LocationMarker map={map}/> 
      <ScrollZoom map={map}/> 
    </MapContainer> 
  ); 
}

export default Map;

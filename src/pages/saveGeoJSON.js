import axios from 'axios';
function saveGeoJSON(geojson) { 
    axios.post('/api/markers/', { 
      geojson: geojson 
    }) 
    .then(response => { 
      console.log(response); 
    }) 
    .catch(error => { 
      console.log(error); 
    }); 
}

export default saveGeoJSON;
// Import stylesheets
//import './style.css';

var municipios_json_link = "https://raw.githubusercontent.com/fj-blanco/js-geogen/master/municipios/municipios_data.json";

var baseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiZmphdmliIiwiYSI6ImNramVvbGlmZDJtYzAycXJ1NGczdTBkaGgifQ.bU5WrKn-xNm5iv_F20QEmA'
});

var cfg = {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  // if scaleRadius is false it will be the constant radius used in pixels
  "radius": 0.5,
  "maxOpacity": .8,
  // scales the radius based on map zoom
  "scaleRadius": true,
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": true,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lng',
  // which field name in your data represents the data value - default "value"
  valueField: 'count'
};

var heatmapLayer = new HeatmapOverlay(cfg);

var map = new L.Map('mapid', {
  center: new L.LatLng(40.4169, -3.7035),
  zoom: 5.3,
  layers: [baseLayer, heatmapLayer]
});

/*var testData = {
  max: 8,
  data: [{lat: 40.4169, lng:-3.7035, count: 3},{lat: 41.5169, lng:-3.8035},{lat: 41.5169, lng:-3.8035},{lat: 41.5169, lng:-3.8035}]
};

heatmapLayer.setData(testData);*/

// gedcom_handler:
const gedcom_file = document.getElementById('gedcom_upload_button');
gedcom_file.addEventListener("change", function() {
      let file = gedcom_file.files[0];
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function() {
        var gedcom_lines = reader.result.split("\n");
        var arr_places_names_all = [];
        for (i = 0; i< gedcom_lines.length; i++)
          if (gedcom_lines[i].substring(2,6) == 'PLAC') {
            arr_places_names_all.push(gedcom_lines[i].substring(7, gedcom_lines[i].indexOf(',')));
          }
        get_municipios_json_parser(json_handler, arr_places_names_all);
      };
      reader.onerror = function() {
        console.log(reader.error);
      };
    });
// Manejador del json:
function json_handler(data, arr_places_names) {
    var obj_municipios = data;
    var arr_places_data = [];
    // Obtenemos los datos de los municipios que tenemos en nuestra lista:
    for (j = 0; j< arr_places_names.length; j++)
      arr_places_data.push(obj_municipios.filter(function (entry) {
      return entry.NOMBRE_ACTUAL == arr_places_names[j];
    })[0]);
    var arr_places_coordinates = [];
    for (k = 0; k< arr_places_data.length; k++)
          arr_places_coordinates.push({lat: arr_places_data[k].LATITUD_ETRS89, lng: arr_places_data[k].LONGITUD_ETRS89});
          //console.log([arr_places_data[k].LATITUD_ETRS89, arr_places_data[k].LONGITUD_ETRS89]);
    //var heat = L.heatLayer(arr_places_coordinates, {radius:12,blur:25,maxZoom:11}).addTo(mymap);
    var testData = {
      max: 8,
      data: [arr_places_coordinates
    };

    heatmapLayer.setData(testData);

}
// Getting the municipalities json by url:
function get_municipios_json_parser(handler_callback) {
  console.log("Fetching data..."); 
  $.getJSON(municipios_json_link).then(data => {
    handler_callback(data, arguments[1]);
  }).catch(error => {
    console.error(error);
  });
}
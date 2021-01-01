// Import stylesheets
//import './style.css';

var municipios_json_link = "https://raw.githubusercontent.com/fj-blanco/js-geogen/master/municipios/municipios_data.json";

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
          arr_places_coordinates.push([arr_places_data[k].LATITUD_ETRS89, arr_places_data[k].LONGITUD_ETRS89]);
          console.log([arr_places_data[k].LATITUD_ETRS89, arr_places_data[k].LONGITUD_ETRS89]);
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
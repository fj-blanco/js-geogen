// Import stylesheets
//import './style.css';

// Write Javascript code!
//const appDiv = document.getElementById('app');
//appDiv.innerHTML = `<h1>JS Starter</h1>`;

//<script type="text/javascript">
      // Obtenemos la lista de municipios:
var municipios_json_link = "https://raw.githubusercontent.com/fj-blanco/js-geogen/master/municipios/municipios_data.json";

// gedcom_handler:
function gedcom_handler(gedcom_file) {
      let file = gedcom_file.files[0];
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function() {
        //console.log(reader.result);
        var gedcom_lines = reader.result.split("\n");
        var arr_places_names_all = [];
        for (i = 0; i< gedcom_lines.length; i++)
          //console.log(n[i].indexOf("PLAC"));
          //console.log(gedcom_lines[i].substring(2,6));
          if (gedcom_lines[i].substring(2,6) == 'PLAC') {
            arr_places_names_all.push(gedcom_lines[i].substring(7, gedcom_lines[i].indexOf(',')));
          }
        /*var arr_places_data_all = coordinates(obj_municipios, arr_places_names_all);
        for (j = 0; j< arr_places_data_all.length; j++)
          console.log(arr_places_data_all[j]);*/
        get_municipios_json_parser(json_handler, arr_places_names_all);
      };
      reader.onerror = function() {
        console.log(reader.error);
      };
    };
function json_handler(data, arr_places_names) {
    var obj_municipios = data;
    var arr_places_data = [];
    // Obtenemos los datos de los municipios que tenemos en nuestra lista:
    for (j = 0; j< arr_places_names.length; j++)
      arr_places_data.push(obj_municipios.filter(function (entry) {
      return entry.NOMBRE_ACTUAL == arr_places_names[j];
    })[0]);
    for (k = 0; k< arr_places_data.length; k++)
          console.log([arr_places_data[k].LATITUD_ETRS89, arr_places_data[k].LONGITUD_ETRS89]);
}
// Getting the municipalities json by url:
function get_municipios_json_parser(handler_callback) {
  console.log("Fetching data..."); 
  $.getJSON(municipios_json_link).then(data => {
    //var obj_municipios = data;
    //console.log(data);
    //console.log(municipios[0].ALTITUD);
    /*console.log(obj_municipios.filter(function (entry) {
      return entry.PROVINCIA === 'Albacete';
    }));*/
    handler_callback(data, arguments[1]);
  }).catch(error => {
    console.error(error);
  });
}

    //</script>
var api_url_position = "http://api.open-notify.org/iss-now.json/"
var api_url_people = "http://api.open-notify.org/astros.json/"
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

function get_the_json(api_url) {
  var xhr = new XMLHttpRequest;
  xhr.open("GET", api_url, false);
  xhr.send( null );
  var json_obj = JSON.parse(xhr.responseText);
  return json_obj;
}

function print_coordintes() {
  var a = document.getElementById('iss');
  a.innerHTML = "<div class='pd-20px'><b> ISS is now located at: </b><br>" +
                 "<i>longitude: " + `${get_the_json(api_url_position)['iss_position']['longitude']}` +
                 ", latitude: " + `${get_the_json(api_url_position)['iss_position']['latitude']}` +
                  "</i></div>";
}

function print_time() {
  var b = document.getElementById('time');
  current_time = new Date
  b.innerHTML = "<div class='pd-20px'><b>Current UTC time: " + `${current_time.getHours()}` +
                `:${(current_time.getMinutes()<10?'0':'') + current_time.getMinutes()}` + "</b><br>" +
                `<i>${weekday[current_time.getDay()]}, ` + `${current_time.getUTCDate()} ` + `${monthNames[current_time.getUTCMonth()]} ` + `${current_time.getUTCFullYear()}` + "</i></div>";
}

function initMap() {
  var myLatLng = set_current_lat_lng()
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng
  });

  function set_marker_position() {
    var marker = new google.maps.Marker({
      position: set_current_lat_lng(),
      map: map,
      title: 'ISS position'
    });
    setTimeout(function () {marker.setMap(null);}, 6000);
  }

  function set_current_lat_lng() {
    latitude  = get_the_json(api_url_position)['iss_position']['latitude'];
    longitude = get_the_json(api_url_position)['iss_position']['longitude'];
    var myLatLng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
    return myLatLng;
  }

  set_marker_position();
  var marker_interval = setInterval(set_marker_position, 5000);
}

function set_the_people_on_board() {
  var b = document.getElementById('people');
  b.innerHTML = null;
  for (var x = 0; x < get_the_json(api_url_people)['people'].length; x++) 
      {
        if (get_the_json(api_url_people)['people'][x]['craft'] == 'ISS')
          {
            b.innerHTML += "<div class='pd-20px names'>" + "<i class='fas fa-user-circle'></i>" + `${get_the_json(api_url_people)['people'][x]['name']}` + "</div>"
          }
      };
   b.innerHTML += "<div class='pd-20px'>Total amount: " + `${get_the_json(api_url_people)['people'].length}` + " people on ISS</div>";
  // b.innerHTML = get_the_json(api_url_people)['people'];
}

$(document).ready(function(){
  document.body.style.display = "initial";
  print_coordintes();
  print_time();
  var print_coordintes_interval = setInterval(print_coordintes, 5000);
  var print_time_interval       = setInterval(print_time, 60000);
  initMap();
  set_the_people_on_board();
  var print_people_interval     = setInterval(set_the_people_on_board, 60000);
});
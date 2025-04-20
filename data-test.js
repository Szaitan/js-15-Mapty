'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let mapEvent;
let map;

// How Geolocation works
navigator.geolocation.getCurrentPosition(
  function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords = [latitude, longitude]; // its setting the localisation coordinates
    map = L.map('map').setView(coords, 13); // 13 is representing zoom it and out option

    // L.titleLayer add a tile layer to add to our map, in this case it’s a OpenStreetMap tile layer.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map); // addto is tageting specific div element from html by id

    // Adding function to create markers when user clicks on map
    map.on('click', function (mapE) {
      // mapevent conatines all data regarding pointclick on map
      mapEvent = mapE;
      form.classList.remove('hidden');
      inputDistance.focus();
    });
  },

  function () {
    alert('Could not get your position.');
  }
);

// Event which
form.addEventListener('submit', function (e) {
  e.preventDefault();
  console.log(mapEvent);
  const { lat, lng } = mapEvent.latlng;
  // Steps of creation marker withpopup
  // 1) We create a marker object
  // 2) We bind it to map object
  // 3) We bind a popup to marker
  // 4) L.popup creates a popup object, with options
  // 5) We set Content of popup with String and Openpopup to be seen from the start

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 50,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('Workout')
    .openPopup(); // L.popup({}) set object of popup which we can modify

  const inputDuration = document.querySelector('.form__input--duration');
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';
});
true;
//Changing the type of workput and its form
inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});

class APP {
  #workouts = [];
  map;
  constructor() {
    this.#_getPosition();
  }

  #_getPosition() {
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const coords = [latitude, longitude];
      map = L.map('map').setView(coords, 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      map.on('click', function (mapE) {
        mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
      });
    });
  }
}

const app = new APP();

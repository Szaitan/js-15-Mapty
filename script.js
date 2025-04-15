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

// How Geolocation works
navigator.geolocation.getCurrentPosition(
  function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`https://www.google.pl/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude]; // its setting the localisation parameters
    const map = L.map('map').setView(coords, 13); // 13 is representing zoom it and out option
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map); // addto is tageting specific div element from html by id
    const marker = L.marker(coords).addTo(map).bindPopup('A pretty CSS3 popup'); // allows us to add and customize marker
  },

  function () {
    alert('Could not get your position.');
  }
);

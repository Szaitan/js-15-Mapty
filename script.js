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

class APP {
  #workouts = [];
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();

    inputType.addEventListener('change', this._toggleElevationField);
    form.addEventListener('submit', this._newWorkout.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this));
    } else {
      alert('Could not get your position.');
    }
  }

  _loadMap(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);
    this._showForm();
  }

  _showForm() {
    this.#map.on('click', mapE => {
      this.#mapEvent = mapE;
      form.classList.remove('hidden');
      inputDistance.focus();
    });
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    console.log(this.#mapEvent);
    const { lat, lng } = this.#mapEvent.latlng;

    const workout = L.marker([lat, lng])
      .addTo(this.#map)
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
      .openPopup();

    this.#workouts.push(workout);
    console.log(this.#workouts);

    const inputDuration = document.querySelector('.form__input--duration');
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }
}

class Workout {
  #distance;
  #duration;
  #coords;
  #date;
  constructor(distance, duration, coords, date) {
    this.#distance = distance;
    this.#duration = duration;
    this.#coords = coords;
    this.#date = date;
  }
}

class Running extends Workout {
  #cadance;
  #pace;
  constructor(distance, duration, coords, date, cadance, pace) {
    super(distance, duration, coords, date);
    this.#cadance = cadance;
    this.#pace = pace;
  }
}

class Cycling extends Workout {
  #elevationGain;
  #speed;
  constructor(distance, duration, coords, date, elevationGain, speed) {
    super(distance, duration, coords, date);
    this.#elevationGain = elevationGain;
    this.#speed = speed;
  }
}

const app = new APP();

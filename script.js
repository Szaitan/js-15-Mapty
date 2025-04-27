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

class Workout {
  #distance;
  #duration;
  #coords;
  #date;
  #id;

  constructor(distance, duration, coords, type) {
    this.#id = new Date();
    this.#date = new Date();
    this.#distance = distance;
    this.#duration = duration;
    this.#coords = coords;
    this.type = type;
  }

  get distance() {
    return this.#distance;
  }
  get duration() {
    return this.#duration;
  }
  get coords() {
    return this.#coords;
  }
  get date() {
    return this.#date;
  }
}

class Running extends Workout {
  #cadance;
  #pace;
  constructor(distance, duration, coords, cadance, type) {
    super(distance, duration, coords, type);
    this.#cadance = cadance;
    this.#pace = this.#calclPace().toFixed(2);
  }

  #calclPace() {
    return this.duration / this.distance;
  }

  get pace() {
    return this.#pace;
  }
}

class Cycling extends Workout {
  #elevationGain;
  #speed;
  constructor(distance, duration, coords, elevationGain, type) {
    super(distance, duration, coords, type);
    this.#elevationGain = elevationGain;
    this.#speed = this.#calcSpeed().toFixed(2);
  }

  #calcSpeed() {
    return this.distance / this.duration / 60;
  }

  get speed() {
    return this.#speed;
  }
}

class APP {
  #workouts = [];
  #map;
  #mapEvent;

  constructor() {
    this.runTurn = true;
    this._getPosition();

    inputType.addEventListener('change', this._toggleElevationField.bind(this));
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
    this.runTurn = !this.runTurn;
  }

  _newWorkout(e) {
    e.preventDefault();
    let namesToUse;
    let dataToUse;

    if (this.runTurn) {
      namesToUse = ['Distance', 'Duration', 'Cadence'];
      dataToUse = [inputDistance, inputDuration, inputCadence];
    } else {
      namesToUse = ['Distance', 'Duration', 'Elevation'];
      dataToUse = [inputDistance, inputDuration, inputElevation];
    }

    let forward = true;
    for (let i = 0; i < dataToUse.length; i++) {
      const ele = dataToUse[i];

      if (ele.value === '') {
        alert(`${namesToUse[i]} can't be empty.`);
        forward = false;
        break;
      }

      // isNaN zwraca true jeśli *nie* jest liczbą (NaN)
      // lepsze: Number.isFinite, bo odrzuca Infinity
      if (!Number.isFinite(Number(ele.value))) {
        alert(`${namesToUse[i]} has to be a number.`);
        forward = false;
        break;
      }

      if (Number(ele.value) < 0) {
        alert(`${namesToUse[i]} can't be lower than 0.`);
        forward = false;
        break;
      }
    }

    if (forward) {
      let workout;
      const { lat, lng } = this.#mapEvent.latlng;
      const workoutType = inputType.value;
      const distance = Number(inputDistance.value);
      const duration = Number(inputDuration.value);
      const coords = [lat, lng];
      const cadance = inputCadence.value;
      const elevationGain = inputElevation.value;

      if (workoutType === 'running') {
        workout = new Running(distance, duration, coords, cadance, workoutType);
      } else {
        workout = new Cycling(
          distance,
          duration,
          coords,
          elevationGain,
          workoutType
        );
      }

      console.log(workout.type);
      // Creating marker on map
      this._renderWorkoutMarker(workout);

      // Adding data to list
      this.#workouts.push(workout);

      // Passing workout to our list
      this._renderWorkoutList(workout);

      // Clearing the fileds from data
      inputDistance.value =
        inputDuration.value =
        inputCadence.value =
        inputElevation.value =
          '';

      form.classList.add('hidden');
    }
  }

  _renderWorkoutMarker(obj) {
    L.marker(obj.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 50,
          autoClose: false,
          closeOnClick: false,
          className: `${obj.type}-popup`,
        })
      )
      .setPopupContent(`${obj.type}`)
      .openPopup();
  }

  _renderWorkoutList(obj) {
    let icon;
    let paceOrSpeed;

    const displayDate = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
    }).format(obj.date);

    if (obj.type === 'running') {
      icon = `<span class="workout__icon">🏃‍♂️</span>`;
      paceOrSpeed = `<div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${obj.pace}</span>
          <span class="workout__unit">spm</span>
        </div>`;
    } else {
      icon = `<span class="workout__icon">🚴‍♀️</span>`;
      paceOrSpeed = `<div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${obj.speed}</span>
          <span class="workout__unit">m</span>
        </div>`;
    }

    const html = `
      <li class="workout workout--${obj.type}" data-id="${obj.date}">
       <h2 class="workout__title">${
         obj.type[0].toUpperCase() + obj.type.slice(1)
       } on ${displayDate}</h2>
        <div class="workout__details">
          ${icon}
          <span class="workout__value">${obj.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${obj.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">4.6</span>
          <span class="workout__unit">min/km</span>
        </div>
        ${paceOrSpeed}
      </li>
    `;
    form.insertAdjacentHTML('afterend', html);
  }
}

const app = new APP();

if (inputType.value === 'cycling') {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  app.runTurn = !app.runTurn;
}

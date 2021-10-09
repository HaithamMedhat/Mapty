'use strict';
import validate , { inputType, inputDistance, inputDuration, inputCadence, inputElevation, form } from '../JS/valiadate.js';
import { Running, Cycling } from '../JS/workout.js';
const containerWorkouts = document.querySelector('.workouts');
let submit = document.getElementById('submit');
let deleteAll = document.getElementById('deleteAll');

$(document).ready(() => {
  $("#loading div").fadeOut(2000, () => {
    $("#loading").fadeOut(2000, () => {
      $("#loading div").empty();
      $("body").css("overflow-y", "auto");
    });
})});


class App extends validate {
  #map;
  #mapEvent;
  #workouts=[];
  #markers=[];
  data =[];
  constructor() {
    
    super();
    this._getPosition();
    document.addEventListener('click',this._deletWorkout.bind(this));
    submit.addEventListener('click', this._add.bind(this));
    containerWorkouts.addEventListener('click', this._moveToPopUP.bind(this));
    this._getLocaleStorage();
    deleteAll.addEventListener('click',this._deleteAllWorkouts.bind(this))

  }
  removeMarker() {
    const marker = this;
    const btn = document.querySelector(".remove");
    btn.addEventListener("click", function () {
      const markerPlace = document.querySelector(".marker-position");
      markerPlace.textContent = "goodbye marker 💩";
      map.removeLayer(marker);
    });
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this));
      console.log('yu');
    }
    () => {
      alert("couldn't get your location");
    };
  }
  _loadMap(position) {
    const { longitude } = position.coords;
    const { latitude } = position.coords;
    this.#map = L.map('map').setView([latitude, longitude], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on('click', this._mapClick.bind(this));
    this.#workouts.forEach(work=>{
      this._renderWorkoutOnMap(work);
    });
  }
  _add(event) {
    event.preventDefault();
    let x = this.validateInputs();
    if (x) {
    const type = inputType.value;
    const distane = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    if(type === 'running'){
      const cadence = inputCadence.value;
       workout = new Running([lat,lng],distane,duration,cadence);
    }
    if(type === 'cycling'){
      const elevation = inputElevation.value;
       workout = new Cycling([lat,lng],distane,duration,elevation);
    }
    this.#workouts.push(workout);
    this._renderWorkoutOnMap(workout);
      this.clearForm();
     this._renderWorkout(workout);
     this._setLocaleStorage();
    }
  }
  _renderWorkoutOnMap(workout){
    let [lat,lng] = workout.coords;
    let t = L.marker([lat, lng], {id:`${workout.id}`}).addTo(this.#map).bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
          id: `${workout.id}`
        })
      ).openPopup().setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`);

    this.#markers.push(t);
  }
  _mapClick(eventMap) {
    this.#mapEvent = eventMap;
    form.classList.remove('d-none');
    form.classList.remove('hidden');

  }
  _renderWorkout(workout){
    let html = `
    <li class="workout workout--${workout.type} position-relative"  data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__details">
      <span><i class="far fa-times-circle position-absolute top-0 end-0"></i></span>
        <span class="workout__icon">${workout.type === 'running' ?'🏃‍♂️' : '🚴‍♀️' }</span>
        <span class="workout__value">${workout.distance}</span>
       <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
    `;
    if(workout.type === 'running'){
      html +=`
      <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
      
      `;}
    if(workout.type === 'cycling'){
      html +=`
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevation}</span>
        <span class="workout__unit">m</span>
      </div>
      `;
    }
    form.insertAdjacentHTML('afterend',html);
  }
  _moveToPopUP(e){
    const workoutEl = e.target.closest('.workout');
    if(!workoutEl) return;
    let workout = this.#workouts.find(work =>work.id === workoutEl.dataset.id);
    this.#map.setView(workout.coords,14,{
      animate : true,
      pan :{
        duration :1,
      }
    });
  }

  _setLocaleStorage(){
    localStorage.setItem('workouts',JSON.stringify(this.#workouts));
  }
  _getLocaleStorage(){
    const data = JSON.parse(localStorage.getItem('workouts'));
    if(!data) return;
    this.#workouts = data;
    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }
  _deletWorkout(e){
    if(e.target && e.target.classList.contains("far")){
      let index ;
      let id ;
      let arr = e.target.closest(".workout");
      id = arr.getAttribute('data-id');
      this.#workouts.forEach((element , i)=>{
        if( arr === element.id){ 
          index=i;
          }
      })
      this.#markers.forEach((element,i)=>{
        // console.log(element.options.id);
        if(id === element.options.id){
          // console.log('aa');
          // console.log(element);
          // // element._removeIcon();
          element.remove();
        }
      }); 
      arr.remove();   
      this.#workouts.splice(index, 1);
      localStorage.setItem("workouts", JSON.stringify(this.#workouts));
    }
  }
    _deleteAllWorkouts(){
      localStorage.removeItem('workouts');
      let all = document.querySelectorAll('.workout');
      console.log(all);
      all.forEach(element => {
        element.remove()
      });
      this.#markers.forEach((element,i)=>{
          element.remove();
        })  
}
}
let app = new App();


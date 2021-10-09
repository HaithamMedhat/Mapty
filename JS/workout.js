class Workout {
    date = new Date();
    id = (Date.now() +'').slice(-10);
    constructor(coords, distance, duration) {
      this.coords = coords; // [lat , lang]
      this.distance = distance;
      this.duration = duration;
    }
    _setdescription(){
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on 
        ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
  }
  export  class Running extends Workout {
    type = 'running';
    constructor(coords, distance, duration, cadence) {
      super(coords, distance, duration);
      this.cadence = cadence;
      this.calcPace();
      this._setdescription();
    }
    calcPace() {
      this.pace = this.duration / this.distance;
      return this.pace;
    }
  }
  export  class Cycling extends Workout {
    type = 'cycling';
    constructor(coords, distance, duration, elevation) {
      super(coords, distance, duration);
      this.elevation = elevation;
      this.calcSpeed();
      this._setdescription();
    }
    calcSpeed() {
      this.speed = this.distance / (this.duration / 60);
      return this.speed;
    }
  }






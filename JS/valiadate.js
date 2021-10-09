export const inputType = document.querySelector('.form__input--type');
export const inputDistance = document.querySelector('.form__input--distance');
export const inputDuration = document.querySelector('.form__input--duration');
export const inputCadence = document.querySelector('.form__input--cadence');
export const inputElevation = document.querySelector('.form__input--elevation');
export const form = document.querySelector('form');
export const regeNum = /^\d+$/;
export default class validate {
  constructor() {
    inputType.addEventListener('change', this._change.bind(this));
  }
  clearForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.classList.add('d-none');
    form.classList.add('hidden');
    setTimeout(()=>{},1000);

  }
  validateInputs() {
    if (inputDistance.value != '' && inputDuration.value != '') {
      if (
        regeNum.test(inputDistance.value) &&
        regeNum.test(inputDuration.value)
      ) {
        return true;
      } else {
        alert('Enter positive numbers Only');
      }
    } else {
      alert('embty fields');
    }
  }
  _change() {
    inputElevation.closest('.change').classList.toggle('form__row--hidden');
    inputCadence.closest('.change').classList.toggle('form__row--hidden');
  }
}


import { FormControl } from '@angular/forms';

export function formatNumber(event: Event, formControl: FormControl): void {
  const inputElement = event.target as HTMLInputElement;
  let inputValue = inputElement.value;
  let rawValue = inputValue.replace(/,/g, '');
  let numericValue = parseInt(rawValue, 10);
  if (isNaN(numericValue)) {
    numericValue = 0;
  }
  formControl.setValue(numericValue, { emitEvent: false });

  if (numericValue === 0) {
    inputElement.value = '';
  } else {
    inputElement.value = numericValue.toLocaleString();
  }
}

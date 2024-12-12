import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ChangeFunctionService {

  constructor() { }
  onDateChange(form: FormGroup, name: string | (string | number)[], date: Date): void {
    if (date) {
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; 
      form.get(name)?.setValue(formattedDate);
    } else {
      form.get(name)?.setValue(null);
    }
  }
}

import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ChangeFunctionService {

  constructor() { }
  onDateChange(form: FormGroup, name: string | (string | number)[], date: any): void {
    console.log("onDateChange called with", { name, date });
  
    const currentValue = form.get(name)?.value;
  
    if (currentValue !== date) {
      const parsedDate = date instanceof Date ? date : new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        const formattedDate = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`;
        form.get(name)?.setValue(formattedDate, { emitEvent: false }); // Ngăn vòng lặp
      } else {
        form.get(name)?.setValue(null, { emitEvent: false });
      }
    }
  }
  
  
}

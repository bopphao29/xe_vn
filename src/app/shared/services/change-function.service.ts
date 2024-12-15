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

        const apiDate = `${parsedDate.getFullYear()}/${String(parsedDate.getMonth() + 1).padStart(2, '0')}/${String(parsedDate.getDate()).padStart(2, '0')}`;
  
        // Lưu giá trị hiển thị (nếu cần) và giá trị API vào form control
        form.get(name)?.setValue(apiDate, { emitEvent: false }); // Giá trị để gửi API
        console.log("Display Date:", apiDate);
      } else {
        form.get(name)?.setValue(null, { emitEvent: false });
      }
    }
  }
  
  
  
}

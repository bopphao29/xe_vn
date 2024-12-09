import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DisableService {

  constructor() { }

  disableAfterDate(name: string, form: FormGroup): (afterDate: Date | null) => boolean {
    return (afterDate: Date | null): boolean => {
      if (!afterDate || !form) return false;
  
      const beforeDate = form.get(name)?.value;
      if (!beforeDate) return false;
  
      const beforeDateObject = new Date(beforeDate);
  
      return afterDate >= beforeDateObject;
    };
  }
  
  disableBeforeDate(name: string, form: FormGroup): (beforeDate: Date | null) => boolean {
    return (beforeDate: Date | null): boolean => {
      if (!beforeDate || !form) return false;
  
      const afterDate = form.get(name)?.value;
      if (!afterDate) return false;
  
      const AfterDateObject = new Date(afterDate);
  
      return beforeDate <= AfterDateObject;
    };
  }
  
}

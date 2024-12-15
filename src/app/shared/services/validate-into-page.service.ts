import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { NUMBER_REGEX, VIETNAMESE_REGEX } from '../constants/common.const';
import { error } from 'pdf-lib';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class ValidateIntoPageService {

  constructor(
    private notification: NotificationService,
    private translate: TranslateService
  ) { }

  validateText(form: FormGroup,path: string | (string | number)[], event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
  
    if(value){
      const invalidCharacters = /[^a-zA-Z\u00C0-\u017F\s]/.test(value);
      if (invalidCharacters) {
        form.get(path)?.setValidators(Validators.pattern(VIETNAMESE_REGEX));
      } 
    }else {
      form.get(path)?.setValidators(Validators.required)
    }
    form.get(path)?.updateValueAndValidity(); 
  }
  

  //////////////////////////////////////validate just enter number input/////////////////
  validateNumber(form: FormGroup, path: string | (string | number)[], event: Event) {
    const valueNum = event.target as HTMLInputElement;
    const control = form.get(path);
  
    if (control) {
      const currentValidators = control.validator ? control.validator({} as AbstractControl) : null;
      
      // Kiểm tra ký tự đầu tiên và thay đổi validators nếu cần thiết
      if (valueNum.value) {
        const checkNumber = /[^0-9]/.test(valueNum.value);
        if (checkNumber && (!currentValidators || !currentValidators['pattern'])) {
          // Thiết lập validator nếu chưa có hoặc không phải là pattern
          control.setValidators(Validators.pattern(NUMBER_REGEX));
        }
      } else {
        if (!currentValidators || !currentValidators['required']) {
          // Thiết lập validator required nếu không có
          control.setValidators(Validators.required);
        }
      }
  
      // Chỉ cập nhật nếu có sự thay đổi trong validators
      control.updateValueAndValidity({ emitEvent: false });
    }
  }
  

  validateYearOfBirth(form: FormGroup,path: string | (string | number)[] ,event: Event, minYear: number, maxyear: number) {
    const valueNum = event.target as HTMLInputElement;
  
    // Kiểm tra ký tự đầu tiên
    if ((valueNum.value)) {
      const checkNumber = /[^0-9]/.test(valueNum.value)
      if(checkNumber){
        form.get(path)?.setValidators(Validators.pattern(NUMBER_REGEX));
      }else{
        form.get(path)?.setValidators([Validators.min(minYear), Validators.max(maxyear)])
      }
    }else{
      form.get(path)?.setValidators(Validators.required)
    }
    form.get(path)?.updateValueAndValidity(); 

  }

  
  validateEnterTextNumber(form: FormGroup, path: string | (string | number)[], event: Event) {
    const valueInput = (event.target as HTMLInputElement).value.trim();
    const control = form.get(path);
  
    if (control) {
      // Xóa toàn bộ validators trước khi thêm mới
      let validators = [Validators.required];
  
      if (VIETNAMESE_REGEX.test(valueInput)) {
        // Là chữ: Không giới hạn độ dài, không thêm validator
      } else if (/^0[0-9]*$/.test(valueInput)) {
        // Là số bắt đầu bằng 0: phải có độ dài là 10
        validators.push(Validators.pattern(/^0\d{9}$/));
      } else if (/^84[0-9]*$/.test(valueInput)) {
        // Là số bắt đầu bằng 84: phải có độ dài là 11
        validators.push(Validators.pattern(/^84\d{9}$/));
      } else {
        // Nếu không khớp bất kỳ điều kiện nào, coi là lỗi định dạng
        validators.push(Validators.pattern(/^(0\d{9}|84\d{9}|[a-zA-Z]*)$/));
      }
  
      // Gán lại validators mới và cập nhật trạng thái
      control.setValidators(validators);
      control.updateValueAndValidity();
    }
  }
  


  validatorsRequired(form: FormGroup,path: string | (string | number)[]): string | undefined{
    const value = form.get(path)
    if(value){
      if(value.invalid  && (value.dirty || value.touched)){
        if(value?.errors?.['required'] || value?.hasError('required')){
          return this.translate.instant('required.cannotBlank');
        }
        if(value?.errors?.['pattern']){
          return this.translate.instant('required.cannotBlank');
          
        } 
      }
    }
    return undefined
  }

  //////////check phone //////////////////////////////
  checkPhoneNumber(form: FormGroup, fieldName: string, maxLengthMap: { [key: string]: number }): void {
    form.get(fieldName)?.valueChanges.subscribe((value: string) => {
      const mockEvent = { target: { value } } as unknown as Event;
      this.validateNumber(form, fieldName, mockEvent);
      
      const sanitizedValue = (mockEvent.target as HTMLInputElement).value;
  
      let maxLength = 10; // Giá trị mặc định
      if (sanitizedValue?.startsWith('84')) {
        maxLength = 11;
      } else if (sanitizedValue?.startsWith('0')) {
        maxLength = 10;
      } else {
        maxLength = 10; // Mặc định
      }
  
      // Cập nhật giá trị maxlength
      maxLengthMap[fieldName] = maxLength;
  
      // Chỉ cập nhật giá trị nếu cần thiết, tránh phát sự kiện không cần thiết
      if (form.get(fieldName)?.value !== sanitizedValue) {
        form.get(fieldName)?.setValue(sanitizedValue, { emitEvent: false });
      }
    });
  }
  
  
}

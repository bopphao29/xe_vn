import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { NUMBER_REGEX, VIETNAMESE_REGEX, ENGLISHTEXT_AND_NUMBER } from '../constants/common.const';
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
      if(path == 'religion'){
        form.get(path)?.clearValidators()
      }
    }
    form.get(path)?.updateValueAndValidity(); 
  }
  

  //////////////////////////////////////validate just enter number input/////////////////
  validateNumber(form: FormGroup, path: string | (string | number)[], event: Event) {
    const valueNum = event.target as HTMLInputElement;
    const control = form.get(path);
  
    if (control) {
      if (valueNum.value) {
        const checkNumber = /[^0-9]/.test(valueNum.value);
        if (checkNumber) {
          // Thiết lập validator nếu chưa có hoặc không phải là pattern
          control.setValidators(Validators.pattern(NUMBER_REGEX));
        }
      } 
      if(valueNum.value == ''){
          control.setValidators(Validators.required);

      }
      control.updateValueAndValidity({ emitEvent: false });
    }
  }
  
  // nếu có value:
  // -nếu mà checkNumber là false thì:
  // check giá trị value, nếu giá trị nhỏ hơn hoặc lớn hơn thì setvalidate.min max
  // - nếu điều kiện checkNumber là true:
  // set validators.pattern
  // nếu không có value: validators.required
  validateYearOfBirth(form: FormGroup,
    path: string | (string | number)[],
    event: Event,
    minYear: number,
    maxYear: number
  ) {
    const valueInput = (event.target as HTMLInputElement).value; // Lấy giá trị từ input
  
    if (valueInput) {
      const checkNumber = /[^0-9]/.test(valueInput); // Kiểm tra có ký tự không phải số
  
      if (!checkNumber) {
        // Nếu chuỗi chỉ chứa số
        const numericValue = Number(valueInput);
  
        if (numericValue < minYear || numericValue > maxYear) {
          // Nếu nằm ngoài khoảng [minYear, maxYear]
          form.get(path)?.setValidators([
            Validators.min(minYear),
            Validators.max(maxYear),
          ]);
        } else {
          // Nếu nằm trong khoảng hợp lệ
          form.get(path)?.clearValidators(); // Xóa tất cả validators
        }
      } else {
        // Nếu chuỗi chứa ký tự không phải số
        form.get(path)?.setValidators(Validators.pattern(NUMBER_REGEX)); // Validator pattern cho số
      }
    } else {
      // Nếu không có giá trị
      form.get(path)?.setValidators(Validators.required); // Validator required
    }
  
    form.get(path)?.updateValueAndValidity(); // Cập nhật lại validators
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

  validatePhone(form: FormGroup, path: string | (string | number)[], event: Event) {
    const valueNum = event.target as HTMLInputElement;
    const control = form.get(path);
  
    if (control) {
      // Kiểm tra nếu có giá trị
      if (valueNum.value) {
        // const checkNumber = /[^0-9]/g.test(valueNum.value);
        // if (checkNumber) {
          // Xóa các validator cũ và thêm validator pattern mới
          control.setValidators([Validators.pattern(/^(0[0-9]{9}|84[0-9]{9})$/)]);
        // } else {
          // Thêm validator bắt cno phải có dạng số
        // }
      } else {
        // Nếu giá trị trống, chỉ cần kiểm tra required
        control.setValidators([Validators.required]);
      }
  
      // Cập nhật lại giá trị và áp dụng các validator mới
      control.updateValueAndValidity({ emitEvent: false });
    }
  }


  //////////check phone //////////////////////////////
  checkPhoneNumber(form: FormGroup, fieldName: string, maxLengthMap: { [key: string]: number }): void {
    form.get(fieldName)?.valueChanges.subscribe((value: string) => {
      const mockEvent = { target: { value } } as unknown as Event;
      this.validatePhone(form, fieldName, mockEvent);
      
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
  
  onBlur(form: FormGroup, path: string | (string | number)[]) {
    const control = form.get(path);
    const value = control?.value; // Loại bỏ khoảng trắng đầu/cuối
  
    if (value == "" || value == null) {
      // Thêm validator nếu không hợp lệ
      control?.setValue("")
      control?.setValidators(Validators.required);
    } else {
      const checkValue = value.test(VIETNAMESE_REGEX)
      // Xóa validator nếu hợp lệ
      if(checkValue == false){
        control?.setValidators(Validators.pattern(VIETNAMESE_REGEX))
      }
      else{
        control?.clearValidators();
      }
    }
  
    // Cập nhật trạng thái form control
    control?.updateValueAndValidity();
  }
  

  onBlurNumber(form: FormGroup, path: string | (string | number)[]) {
    const control = form.get(path);
    const value = control?.value?.trim(); // Loại bỏ khoảng trắng đầu/cuối
  
    // Giá trị giới hạn
    var year = new Date()
  
    if (value) {
      const cleanStr = value.test(/[^0-9]/g, ""); // Chỉ giữ lại các ký tự số
  
      if (cleanStr === "") {
        control?.setValue(""); // Đặt giá trị về rỗng nếu không hợp lệ
        control?.setValidators([Validators.required]);
      } else {
        const numericValue = parseInt(cleanStr, 10); // Chuyển chuỗi số thành số nguyên

        control?.setValue(numericValue); // Đảm bảo giá trị được làm sạch
      }
    } else {
      // Nếu giá trị rỗng, chỉ thêm `Validators.required`
      control?.setValidators([Validators.required]);
    }
  
    // Cập nhật trạng thái form control
    control?.updateValueAndValidity();
  }


  validatorNumberAndEnglishText(form: FormGroup, path: string | (string | number)[], event: Event){
    const valueInput = (event.target as HTMLInputElement).value.trim(); // Lấy giá trị và loại bỏ khoảng trắng đầu/cuối
  const control = form.get(path);

  if (valueInput) {
    // Nếu có giá trị
    const checkValue = ENGLISHTEXT_AND_NUMBER.test(valueInput); // Kiểm tra giá trị có hợp lệ không
    if (checkValue) {
      // Nếu là chữ tiếng Anh và số
      control?.clearValidators(); // Loại bỏ tất cả validators
    } else {
      // Nếu không hợp lệ
      control?.setValidators(Validators.pattern(ENGLISHTEXT_AND_NUMBER)); // Set pattern validator
    }
  } else {
    // Nếu không có giá trị
    control?.setValidators(Validators.required); // Set required validator
  }

  control?.updateValueAndValidity();
  }
  
}

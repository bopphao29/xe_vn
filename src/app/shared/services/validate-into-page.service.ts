import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { FormGroup, Validators } from '@angular/forms';
import { VIETNAMESE_REGEX } from '../constants/common.const';

@Injectable({
  providedIn: 'root'
})
export class ValidateIntoPageService {

  constructor(
    private notification: NotificationService
  ) { }

  validateText(form: FormGroup, path: string | (string | number)[], event: Event) {
    const inputElement = event.target as HTMLInputElement;
  
    const pattern = VIETNAMESE_REGEX;
  
    if (inputElement.value && !pattern.test(inputElement.value)) {
      inputElement.value = inputElement.value.replace(VIETNAMESE_REGEX, '');
      form.get(path)?.setValidators(Validators.pattern(VIETNAMESE_REGEX))
    }
  }

  //////////////////////////////////////validate just enter number input/////////////////
  validateNumber(event: Event) {
    const valueNum = event.target as HTMLInputElement;
  
    // Kiểm tra ký tự đầu tiên
    if (valueNum.value && /[^0-9]/.test(valueNum.value)) {
      // this.notification.warning('Không được nhập ký tự đặc biệt và chữ!')
    valueNum.value = valueNum.value.replace(/[^0-9]/g, '');

    }
    // Loại bỏ tất cả ký tự không phải số
    // valueNum.value = valueNum.value.replace(/[^0-9]/g, '');
  }

  //////////check phone //////////////////////////////
  checkPhoneNumber(form: FormGroup, fieldName: string, maxLengthMap: { [key: string]: number }): void {
    form.get(fieldName)?.valueChanges.subscribe((value: string) => {
      // Tạo một Event giả để xử lý
      const mockEvent = { target: { value } } as unknown as Event;

      // Gọi hàm validateNumber để xử lý giá trị
      this.validateNumber(mockEvent);

      // Lấy giá trị đã xử lý
      const sanitizedValue = (mockEvent.target as HTMLInputElement).value;

      // Cập nhật giá trị vào FormControl
      form.get(fieldName)?.setValue(sanitizedValue, { emitEvent: false });

      // Cập nhật maxlength dựa trên đầu số
      let maxLength = 10; // Giá trị mặc định
      if (sanitizedValue?.startsWith('84')) {
        maxLength = 11;
      } else if (sanitizedValue?.startsWith('0')) {
        maxLength = 10;
      }else if (sanitizedValue?.startsWith('8')) {
        maxLength = 11;
      } else {
        maxLength = 10; // Mặc định
      }
      // Lưu giá trị maxlength vào bản đồ
      maxLengthMap[fieldName] = maxLength;
    });
  }
}

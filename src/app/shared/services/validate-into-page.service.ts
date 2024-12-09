import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidateIntoPageService {

  constructor(
    private notification: NotificationService
  ) { }

  validateText(form: FormGroup, path: string | (string | number)[], event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let originalValue = inputElement.value;
  
    // Biểu thức chính quy cho phép chữ cái tiếng Việt và dấu cách
    const pattern = /^[a-zA-Zà-ỹÀ-Ỹ\s]*$/;
  
    if (inputElement.value && !pattern.test(inputElement.value)) {
      this.notification.warning('Không nhập ký tự đặc biệt hoặc số!')
      // valueNum.value = valueNum.value.slice(1); // Loại bỏ ký tự đầu tiên
    }
    // Loại bỏ tất cả ký tự không hợp lệ (chỉ cho phép chữ cái và dấu cách)
    // let sanitizedValue = originalValue.replace(/[^a-zA-Zà-ỹÀ-Ỹ\s]/g, '');
  
    // // Nếu có ký tự đầu tiên không hợp lệ, xóa nó
    // if (sanitizedValue[0] && !/^[a-zA-Zà-ỹÀ-Ỹ]/.test(sanitizedValue[0])) {
    //   sanitizedValue = sanitizedValue.slice(1);
    // }
  
    // // Cập nhật giá trị trong FormControl, không trực tiếp thay đổi input
    // const control = form.get(path);
    // if (control) {
    //   control.setValue(sanitizedValue, { emitEvent: false });
    // }
  }
  
  
  
  //////////////////////////////////////validate just enter number input/////////////////
  validateNumber(event: Event) {
    const valueNum = event.target as HTMLInputElement;
  
    // Kiểm tra ký tự đầu tiên
    if (valueNum.value && /[^0-9]/.test(valueNum.value)) {
      this.notification.warning('Không được nhập ký tự đặc biệt và chữ!')
      // valueNum.value = valueNum.value.slice(1); // Loại bỏ ký tự đầu tiên
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
      if (sanitizedValue.startsWith('84')) {
        maxLength = 11;
      } else if (sanitizedValue.startsWith('0')) {
        maxLength = 10;
      }else if (sanitizedValue.startsWith('8')) {
        maxLength = 11;
      } else {
        maxLength = 10; // Mặc định
      }
      // Lưu giá trị maxlength vào bản đồ
      maxLengthMap[fieldName] = maxLength;
    });
  }
}

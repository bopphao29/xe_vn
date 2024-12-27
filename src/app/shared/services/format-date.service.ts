import { Injectable } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatDateService implements PipeTransform {

  constructor() { }

  transform(value: Date | string | null): string {
    if (!value) return '';
    const date = new Date(value); // Chuyển đổi thành kiểu Date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Thêm '0' nếu cần
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`; 
  }
}

import { Injectable } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  constructor(private notification : NotificationService) { }

  beforeUpload = (file: NzUploadFile): boolean => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'; // Lọc file JPG/PNG
    const isLt1GB = file.size! / 1024 / 1024 / 1024 < 1; // Kiểm tra kích thước file < 1GB
    
    if (!isJpgOrPng) {
      this.notification.error('Bạn chỉ có thể tải lên file JPG hoặc PNG!');
      return false; // Ngăn tải lên nếu không phải JPG/PNG
    }
    
    if (!isLt1GB) {
      this.notification.error('File phải nhỏ hơn 1GB!');
      return false; // Ngăn tải lên nếu file lớn hơn 1GB
    }
  
    return true; // File hợp lệ
  };
}

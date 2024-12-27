import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { EmailValidator, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-item-check',
  standalone: true,
  imports: [
    CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzButtonModule,
        TranslateModule,
        NzModalModule,
        NzPaginationModule,
  ],
  templateUrl: './item-check.component.html',
  styleUrl: './item-check.component.scss'
})
export class ItemCheckComponent {
  @Output() dataEmitter = new EventEmitter<any[]>()

  constructor(
    ){
  
    }
  isItemCheck : boolean = false
  isDeleteStatusVehicle: boolean =false
  testItemInput: string = ''
  testItemList: Array<{ id: number; testItem: string }> = [];

  sendDataToParent(){
    this.dataEmitter.emit(this.testItemList)
  }
//phan trang
displayedData: Array<{ id: number; testItem: string }> = []; // Dữ liệu hiển thị
pageIndex: number = 1; 
pageSize: number = 9; 
total: number = 0; 
onPageChange(page: number): void {
  this.pageIndex = page;
  this.updateDisplayedData();
}

updateDisplayedData(): void {
  const startIndex = (this.pageIndex - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.displayedData = this.testItemList.slice(startIndex, endIndex);
}

editVehicleStatus(item: { id: number; testItem: string }): void {
  this.testItemInput = item.testItem; // Gán giá trị từ item vào biến ngModel
  this.isItemCheck = true; // Mở modal
  this.isEditMode = true; // Chuyển sang chế độ sửa
}


isEditMode = false;
onAdd(){
  this.testItemInput = '';
  this.isItemCheck = true
}


handleCancelisItemCheck(): void {
  this.testItemInput = ''; // Reset giá trị nhập vào
  this.isItemCheck = false; // Đóng modal
  this.isEditMode = false; // Reset chế độ sửa
}


handleSubmitisItemCheck(): void {
    if (this.testItemInput.trim()) {
      if (this.isEditMode) {
        // Cập nhật đối tượng đã chọn trong danh sách
        const index = this.testItemList.findIndex(item => item.id === this.testItemList.length); // Tìm đối tượng cũ dựa vào id
        if (index !== -1) {
          this.testItemList[index].testItem = this.testItemInput; // Cập nhật trạng thái xe
        }
      } else {
        // Thêm mới
        this.testItemList.push({
          id: this.testItemList.length + 1,
          testItem: this.testItemInput
        });
      }
      this.total = this.testItemList.length; // Cập nhật tổng số mục
      this.updateDisplayedData(); // Cập nhật danh sách hiển thị
    }
    this.isItemCheck = false; // Đóng modal
    this.isEditMode = false; // Đặt lại chế độ
    this.sendDataToParent()
  }  

  
  handleCancelDeleteStatusVehicle(){
    
  }
  
  handleSubmitDeleteStatusVehicle(){

  }

 
  onSubmit(){

  }

  
}

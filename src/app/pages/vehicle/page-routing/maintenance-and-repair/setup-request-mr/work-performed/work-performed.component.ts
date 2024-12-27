import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-work-performed',
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
  templateUrl: './work-performed.component.html',
  styleUrl: './work-performed.component.scss'
})
export class WorkPerformedComponent {
  @Output() dataEmitter = new EventEmitter<any[]>()
  constructor(
  ){

  }
  isWorkPerformed : boolean = false
  isDeleteStatusVehicle: boolean = false
  workPerformedInput: string = ''
  workPerformedList: Array<{ id: number; workPerformed: string }> = [];

  sendDataToParent(){
    this.dataEmitter.emit(this.workPerformedList)
  }
//phan trang
displayedData: Array<{ id: number; workPerformed: string }> = []; // Dữ liệu hiển thị
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
  this.displayedData = this.workPerformedList.slice(startIndex, endIndex);
}

editWorkPerformed(item: { id: number; workPerformed: string }): void {
  this.workPerformedInput = item.workPerformed; // Gán giá trị từ item vào biến ngModel
  this.isWorkPerformed = true; // Mở modal
  this.isEditMode = true; // Chuyển sang chế độ sửa
}


isEditMode = false;
onAdd(){
  this.workPerformedInput = '';
  this.isWorkPerformed = true
}


handleCancelisWorkPerformed(): void {
  this.workPerformedInput = ''; // Reset giá trị nhập vào
  this.isWorkPerformed = false; // Đóng modal
  this.isEditMode = false; // Reset chế độ sửa
}


handleSubmitisWorkPerformed(): void {
    if (this.workPerformedInput.trim()) {
      if (this.isEditMode) {
        // Cập nhật đối tượng đã chọn trong danh sách
        const index = this.workPerformedList.findIndex(item => item.id === this.workPerformedList.length); // Tìm đối tượng cũ dựa vào id
        if (index !== -1) {
          this.workPerformedList[index].workPerformed = this.workPerformedInput; // Cập nhật trạng thái xe
        }
      } else {
        // Thêm mới
        this.workPerformedList.push({
          id: this.workPerformedList.length + 1,
          workPerformed: this.workPerformedInput
        });
      }
      this.total = this.workPerformedList.length; // Cập nhật tổng số mục
      this.updateDisplayedData(); // Cập nhật danh sách hiển thị
    }
    this.isWorkPerformed = false; // Đóng modal
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

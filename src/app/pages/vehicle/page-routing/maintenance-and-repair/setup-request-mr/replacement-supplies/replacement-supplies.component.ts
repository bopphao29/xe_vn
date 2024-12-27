import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-replacement-supplies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    TranslateModule,
    NzModalModule,
    NzPaginationModule,
    NzSelectModule,
    
  ],
  templateUrl: './replacement-supplies.component.html',
  styleUrl: './replacement-supplies.component.scss'
})
export class ReplacementSuppliesComponent {
    @Output() dataEmitter = new EventEmitter<any[]>()
  constructor(
  ){

  }
  isreplacementSupplies : boolean = false
  isDeleteStatusVehicle: boolean = false
  supplyId: string = ''
  unit : string = '' 
  quantity: number = 0
  replacementSuppliesList: Array<{ id: number; supplyId: string; quantity: number ;unit: string }> = [];

//phan trang
displayedData: Array<{ id: number; supplyId: string; quantity: number ;unit: string }> = []; // Dữ liệu hiển thị
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
  this.displayedData = this.replacementSuppliesList.slice(startIndex, endIndex);
}

editreplacementSupplies(item: { id: number; supplyId: string; quantity: number ;unit: string }): void {
  this.supplyId = item.supplyId; // Gán giá trị từ item vào biến ngModel
  this.quantity = item.quantity
  this.unit = item.unit
  this.isreplacementSupplies = true; // Mở modal
  this.isEditMode = true; // Chuyển sang chế độ sửa
}


isEditMode = false;
onAdd(){
  this.supplyId = '';
  this.quantity = 0;
  this.unit = ''
  this.isreplacementSupplies = true
}


handleCancelisreplacementSupplies(): void {
  this.supplyId = ''; // Reset giá trị nhập vào
  this.quantity = 0;
  this.unit = ''
  this.isreplacementSupplies = false; // Đóng modal
  this.isEditMode = false; // Reset chế độ sửa
}


handleSubmitisreplacementSupplies(): void {
    if (this.supplyId.trim()) {
      if (this.isEditMode) {
        // Cập nhật đối tượng đã chọn trong danh sách
        const index = this.replacementSuppliesList.findIndex(item => item.id === this.replacementSuppliesList.length); // Tìm đối tượng cũ dựa vào id
        if (index !== -1) {
          this.replacementSuppliesList[index].supplyId = this.supplyId; 
          this.replacementSuppliesList[index].quantity = this.quantity; 
          this.replacementSuppliesList[index].unit = this.unit; 
        }
      } else {
        // Thêm mới
        this.replacementSuppliesList.push({
          id: this.replacementSuppliesList.length + 1,
          supplyId: this.supplyId,
          quantity: this.quantity,
          unit: this.unit
        });
      }
      this.total = this.replacementSuppliesList.length; // Cập nhật tổng số mục
      this.updateDisplayedData(); // Cập nhật danh sách hiển thị
    }
    this.isreplacementSupplies = false; // Đóng modal
    this.isEditMode = false; // Đặt lại chế độ
    this.sendDataToParent()

  }  
  sendDataToParent() {
    this.dataEmitter.emit(this.replacementSuppliesList)

  }

  
  handleCancelDeleteStatusVehicle(){
    
  }
  
  handleSubmitDeleteStatusVehicle(){

  }

 
  onSubmit(){

  }
}


import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { EmailValidator, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { VehicalServiceService } from '../../../../../../shared/services/vehical-service.service';

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
        NzAutocompleteModule

  ],
  templateUrl: './item-check.component.html',
  styleUrl: './item-check.component.scss'
})
export class ItemCheckComponent implements OnInit{
    @Input() parentData: any[] = [];
  @Output() updateList = new EventEmitter<any[]>();

  
  @Output() dataEmitter = new EventEmitter<any[]>()
  data : any[] = []

   ngOnChanges(changes: SimpleChanges) {
      if (changes['parentData']) {
        this.testItemList = this.parentData.map(item => ({
          id: item.id,
          testItemInput: item.name,
          ...item,
        }));
        this.displayedData = this.parentData.map(item => ({
          id: item.id,
          testItemInput: item.name,
          ...item,
        }));
      }
    }
  constructor(
    private vehicleServices: VehicalServiceService
    ){}

  ngOnInit(): void {
    this.testCategories()
  }
  isItemCheck : boolean = false
  isDeleteItemCheck: boolean =false
  testItemInput: string = ''
  testItemList: Array<{ id: number; testItemInput: string }> = [];

//phan trang
displayedData: Array<{ id: number; testItemInput: string }> = []; // Dữ liệu hiển thị
pageIndex: number = 1; 
pageSize: number = 9; 
total: number = 0; 
onPageChange(page: number): void {
  this.pageIndex = page;
  this.updateDisplayedData();
}

options: any[] = []
dataOption: any[] = []
filteredOptions: any[] = []
onChange(value: string): void {
  this.filteredOptions = this.dataOption.filter(name =>
    name.toLowerCase().includes(value.toLowerCase())
  );
}

testCategories() {
  this.vehicleServices.testCategories().subscribe(
    {next: (response : any) => {
      console.log(response.data)
      if (response && response.data) {
        this.options = (response?.data || []).filter((option: any) => option.name != null);
         this.dataOption = this.options.map((data: any)=> data.name)

        this.filteredOptions = [...this.dataOption];
      } else {
        this.options = [];
        this.filteredOptions = [];
      }
    },
    error : (error) => {
      console.error('Lỗi khi gọi API:', error);
      this.options = [];
      this.filteredOptions = [];
    }}
  );
}

updateDisplayedData(): void {
  const startIndex = (this.pageIndex - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.displayedData = this.testItemList.slice(startIndex, endIndex);
}

selectedItemId: number | null = null; 

edit(item: { id: number; testItemInput: string }): void {
  this.testItemInput = item.testItemInput; // Gán giá trị từ item vào biến ngModel
  this.isItemCheck = true; // Mở modal
  this.isEditMode = true; // Chuyển sang chế độ sửa
  this.selectedItemId = item.id; // Lưu `id` của mục được chọn

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
      if (this.isEditMode && this.selectedItemId !== null) {
        const index = this.testItemList.findIndex(
          (item) => item.id === this.selectedItemId
        );
        if (index !== -1) {
          this.testItemList[index].testItemInput = this.testItemInput; // Cập nhật trạng thái xe
        }
      } else {
        // Thêm mới
        this.testItemList.push({
          id: this.testItemList.length + 1,
          testItemInput: this.testItemInput
        });
      }
      this.total = this.testItemList.length; // Cập nhật tổng số mục
      this.updateDisplayedData(); // Cập nhật danh sách hiển thị
    }
    this.isItemCheck = false; // Đóng modal
    this.isEditMode = false; // Đặt lại chế độ
    this.selectedItemId = null,
    this.sendDataToParent()
  }  
  
  itemCheckToDelete: any = null; // Lưu đối tượng cần xóa

  openDeleteModal(item: any): void {
    // Mở modal xóa và điền thông tin vào
    this.isDeleteItemCheck = true;
    this.itemCheckToDelete = item; // Lưu thông tin đối tượng cần xóa
    this.testItemInput = item.testItemInput; // Điền trạng thái xe vào modal
  }
  
  handleCancelDeleteItemCheck(): void {
    // Đóng modal xóa
    this.isDeleteItemCheck = false;
    this.itemCheckToDelete = null; // Xóa thông tin đối tượng cần xóa

  }
  
  handleSubmitDeleteItemCheck(): void {
    if (this.itemCheckToDelete) {
      // Xóa trạng thái xe khỏi danh sách
      this.testItemList = this.testItemList.filter(
        item => item.id !== this.itemCheckToDelete.id
      );
  
      // Cập nhật danh sách hiển thị
      this.updateDisplayedData();
      this.total = this.testItemList.length; // Cập nhật tổng số mục
      this.testItemList = this.testItemList
      
    }
  
    // Đóng modal xóa
    this.isDeleteItemCheck = false;
    this.itemCheckToDelete = null;
    this.sendDataToParent()
  }

  sendDataToParent(){
    console.log(this.testItemList)
    this.dataEmitter.emit(this.testItemList)
    this.updateList.emit(this.testItemList);
  }
  
}

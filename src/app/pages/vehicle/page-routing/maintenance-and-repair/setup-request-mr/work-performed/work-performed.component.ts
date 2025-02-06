import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { VehicalServiceService } from '../../../../../../shared/services/vehical-service.service';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';

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
      NzAutocompleteModule,
      NzPaginationModule,
  ],
  templateUrl: './work-performed.component.html',
  styleUrl: './work-performed.component.scss'
})
export class WorkPerformedComponent implements OnInit{
  @Input() parentData: any[] = [];
  @Output() updateList = new EventEmitter<any[]>();

  
  @Output() dataEmitter = new EventEmitter<any[]>()
  constructor(
    private vehicleServices: VehicalServiceService
  ){}
  ngOnInit(): void {
    this.workPerformeds()
  }
  ngOnChanges(changes: SimpleChanges) {
        if (changes['parentData']) {
          this.workPerformedList = this.parentData.map(item => ({
            id: item.id,
            workPerformedInput: item.name,
            ...item,
          }));
          this.displayedData = this.parentData.map(item => ({
            id: item.id,
            workPerformedInput: item.name,
            ...item,
          }));
        }
      }
  isWorkPerformed : boolean = false
  isDeleteworkPerformed: boolean = false
  workPerformedInput: string = ''
  workPerformedList: Array<any> = [];

  sendDataToParent(){
    this.dataEmitter.emit(this.workPerformedList)
    this.updateList.emit(this.workPerformedList);

  }
//phan trang
displayedData: Array<{ id: number; workPerformedInput: string }> = []; // Dữ liệu hiển thị
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

workPerformeds() {
  this.vehicleServices.workPerformeds().subscribe(
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
  this.displayedData = this.workPerformedList.slice(startIndex, endIndex);
}

selectedItemId: number | null = null; 

edit(item: { id: number; workPerformedInput: string }): void {
  this.workPerformedInput = item.workPerformedInput; // Gán giá trị từ item vào biến ngModel
  this.isWorkPerformed = true; // Mở modal
  this.isEditMode = true; // Chuyển sang chế độ sửa
  this.selectedItemId = item.id;
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
      if (this.isEditMode && this.selectedItemId !== null) {
        const index = this.workPerformedList.findIndex(
          (item) => item.id === this.selectedItemId
        );
        if (index !== -1) {
          this.workPerformedList[index].workPerformedInput = this.workPerformedInput; // Cập nhật trạng thái xe
        }
      } else {
        // Thêm mới
        this.workPerformedList.push({
          id: this.workPerformedList.length + 1,
          workPerformedInput: this.workPerformedInput
        });
      }
      this.workPerformedList = this.workPerformedList
      this.total = this.workPerformedList.length; // Cập nhật tổng số mục
      this.updateDisplayedData(); // Cập nhật danh sách hiển thị
    }
    this.isWorkPerformed = false; // Đóng modal
    this.isEditMode = false; // Đặt lại chế độ
    this.selectedItemId = null
    
    this.sendDataToParent()

  }  

  workPerformedDelete: any = null; // Lưu đối tượng cần xóa
  
  openDeleteModal(item: any): void {
    // Mở modal xóa và điền thông tin vào
    this.isDeleteworkPerformed = true;
    this.workPerformedDelete = item; // Lưu thông tin đối tượng cần xóa
    this.workPerformedInput = item.workPerformedInput; // Điền trạng thái xe vào modal
  }
  
  handleCancelDeleteworkPerformed(): void {
    // Đóng modal xóa
    this.isDeleteworkPerformed = false;
    this.workPerformedDelete = null; // Xóa thông tin đối tượng cần xóa
  }
  
  handleSubmitDeleteworkPerformed(): void {
    if (this.workPerformedDelete) {
      // Xóa trạng thái xe khỏi danh sách
      this.workPerformedList = this.workPerformedList.filter(
        item => item.id !== this.workPerformedDelete.id
      );
  
      // Cập nhật danh sách hiển thị
      this.updateDisplayedData();
      this.total = this.workPerformedList.length; // Cập nhật tổng số mục
      this.workPerformedList = this.workPerformedList 
    }
  
    // Đóng modal xóa
    this.isDeleteworkPerformed = false;
    this.workPerformedDelete = null;
    this.sendDataToParent()
  }

}

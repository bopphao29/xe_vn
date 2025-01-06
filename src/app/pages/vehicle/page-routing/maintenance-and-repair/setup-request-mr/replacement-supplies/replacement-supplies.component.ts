import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { VehicalServiceService } from '../../../../../../shared/services/vehical-service.service';

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
    NzAutocompleteModule
    
  ],
  templateUrl: './replacement-supplies.component.html',
  styleUrl: './replacement-supplies.component.scss'
})
export class ReplacementSuppliesComponent implements OnInit{
    @Input() parentData: any[] = [];
    
    @Output() dataEmitter = new EventEmitter<any[]>()

    ngOnChanges(changes: SimpleChanges) {
          if (changes['parentData']) {
            this.replacementSuppliesList = this.parentData.map(item => ({
              id: item.id,
              quantity: item.quantity,
              unit: item.unit,
              supplyId: item.supplyId,
              ...item,
            }));
            this.displayedData = this.parentData.map(item => ({
              id: item.id,
              quantity: item.quantity,
              unit: item.unit,
              supplyId: item.supplyId,
              ...item,
            }));
          }
        }
  constructor(
    private vehicleServices: VehicalServiceService
  ){

  }

  ngOnInit(): void {
    this.supplies()
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


options: any[] = []
optionUnits: any[] = []
dataOption: any[] = []
dataOptionUnits: any[] = []
filteredOptions: any[] = []
filteredOptionUnits: any[] = []
filteredUnit: any[] = []
onChange(value: string, nameInput: string): void {
  if(nameInput == 'supplyId'){
    this.filteredOptions = this.dataOption.filter(name =>
      name.toLowerCase().includes(value.toLowerCase())
    );
  }else{
    this.filteredOptionUnits = this.dataOptionUnits.filter(name =>
      name.toLowerCase().includes(value.toLowerCase())
    );
  }

}

supplies() {
  this.vehicleServices.supplies().subscribe(
    {next: (response : any) => {
      console.log(response.data)
      if (response && response.data) {
        this.options = (response?.data || []).filter((option: any) => option.supplyName != null);
        this.dataOption = this.options.map((data: any)=> data.supplyName)
        this.filteredOptions = [...this.dataOption];

        this.optionUnits = (response?.data || []).filter((option: any) => option.unit != null);
        this.dataOptionUnits = Array.from(new Set(this.optionUnits.map((data: any) => data.unit)));
        this.filteredOptionUnits = [...this.dataOptionUnits];
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

  
  replacementSuppliesToDelete: any = null; // Lưu đối tượng cần xóa
  isDeleteReplacementSupplies: boolean = false
  openDeleteModal(item: any): void {
    // Mở modal xóa và điền thông tin vào
    this.isDeleteReplacementSupplies = true;
    this.replacementSuppliesToDelete = item; // Lưu thông tin đối tượng cần xóa
    this.supplyId = item.supplyId; // Điền trạng thái xe vào modal
    this.quantity = item.quantity; 
    this.unit = item.unit; 
  }
  
  handleCancelisDeleteReplacementSupplies(): void {
    // Đóng modal xóa
    this.isDeleteReplacementSupplies = false;
    this.replacementSuppliesToDelete = null; // Xóa thông tin đối tượng cần xóa
  }
  
  handleSubmitisDeleteReplacementSupplies(): void {
    if (this.replacementSuppliesToDelete) {
      // Xóa trạng thái xe khỏi danh sách
      this.replacementSuppliesList = this.replacementSuppliesList.filter(
        item => item.id !== this.replacementSuppliesToDelete.id
      );
  
      // Cập nhật danh sách hiển thị
      this.updateDisplayedData();
      this.total = this.replacementSuppliesList.length; // Cập nhật tổng số mục
    }
  
    // Đóng modal xóa
    this.isDeleteReplacementSupplies = false;
    this.replacementSuppliesToDelete = '';
    this.sendDataToParent()
  }

}


import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ModalVehicalComponent } from '../../../../../../shared/modals/modal-vehical/modal-vehical.component';
import { DialogService } from '../../../../../../shared/services/dialog.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { VehicalServiceService } from '../../../../../../shared/services/vehical-service.service';

@Component({
  selector: 'app-car-status',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    TranslateModule,
    NzModalModule,
    NzPaginationModule,
    NzAutocompleteModule,
  ],
  templateUrl: './car-status.component.html',
  styleUrl: './car-status.component.scss',
})
export class CarStatusComponent implements OnInit {
  @Input() parentData: any[] = [];
  @Output() dataEmitter = new EventEmitter<any[]>();
  @Input() isFromRequestMr: boolean = false;
  @Input() isEdit: boolean = false;

  data: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['parentData']) {
      this.statusVehicleList = this.parentData.map((item) => ({
        id: item.id,
        vehicleStatus: item.name,
        ...item,
      }));
      this.displayedData = this.parentData.map((item) => ({
        id: item.id,
        vehicleStatus: item.name,
        ...item,
        isAdd: false,
      }));

      console.log(this.isFromRequestMr);
      console.log(this.isEdit);
    }
  }
  constructor(
    private dialogService: DialogService,
    private vehicleServices: VehicalServiceService
  ) {}

  ngOnInit(): void {
    this.vehicleStatuses();
  }

  isStatusVehicle: boolean = false;
  isDeleteStatusVehicle: boolean = false;
  statusVehicle: string = '';
  statusVehicleList: Array<any> = [];

  //phan trang
  displayedData: Array<any> = []; // Dữ liệu hiển thị
  pageIndex: number = 1;
  pageSize: number = 9;
  total: number = 0;
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.updateDisplayedData();
  }

  options: any[] = [];
  filteredOptions: any[] = [];
  dataOption: any[] = [];

  onChange(value: string): void {
    this.filteredOptions = this.options.filter((name: any) =>
      name.toLowerCase().includes(value.toLowerCase())
    );
  }

  vehicleStatuses() {
    this.vehicleServices.vehicleStatuses().subscribe({
      next: (response: any) => {
        console.log(response.data);
        if (response && response.data) {
          this.options = (response?.data || []).filter(
            (option: any) => option.name != null
          );
          this.dataOption = this.options.map((data: any) => data.name);

          this.filteredOptions = [...this.dataOption];
        } else {
          this.options = [];
          this.filteredOptions = [];
        }
      },
      error: (error) => {
        console.error('Lỗi khi gọi API:', error);
        this.options = [];
        this.filteredOptions = [];
      },
    });
  }

  updateDisplayedData(): void {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedData = this.statusVehicleList.slice(startIndex, endIndex);
  }

  editVehicleStatus(item: { id: number; vehicleStatus: string }): void {
    this.statusVehicle = item.vehicleStatus; // Gán giá trị từ item vào biến ngModel
    this.isStatusVehicle = true; // Mở modal
    this.isEditMode = true; // Chuyển sang chế độ sửa
  }

  isEditMode = false;
  onAdd() {
    this.statusVehicle = '';
    this.isStatusVehicle = true;
  }

  handleCancelisStatusVehicle(): void {
    this.statusVehicle = ''; // Reset giá trị nhập vào
    this.isStatusVehicle = false; // Đóng modal
    this.isEditMode = false; // Reset chế độ sửa
  }

  handleSubmitStatusVehicle(): void {
    if (this.statusVehicle.trim()) {
      if (this.isEditMode) {
        // Cập nhật đối tượng đã chọn trong danh sách
        const index = this.statusVehicleList.findIndex(
          (item) => item.id === this.statusVehicleList.length
        ); // Tìm đối tượng cũ dựa vào id
        if (index !== -1) {
          this.statusVehicleList[index].vehicleStatus = this.statusVehicle; // Cập nhật trạng thái xe
        }
      } else {
        // Thêm mới
        this.statusVehicleList.push({
          id: this.statusVehicleList.length + 1,
          vehicleStatus: this.statusVehicle,
          isAdd: true,
        });
      }
      this.total = this.statusVehicleList.length; // Cập nhật tổng số mục
      this.updateDisplayedData(); // Cập nhật danh sách hiển thị
    }
    this.isStatusVehicle = false; // Đóng modal
    this.isEditMode = false; // Đặt lại chế độ
    this.sendDataToParent();
    console.log(this.statusVehicleList);
  }

  sendDataToParent(): void {
    this.dataEmitter.emit(this.statusVehicleList); // Gửi dữ liệu ra ngoài
  }

  statusVehicleToDelete: any = null; // Lưu đối tượng cần xóa

  openDeleteModal(item: any): void {
    // Mở modal xóa và điền thông tin vào
    this.isDeleteStatusVehicle = true;
    this.statusVehicleToDelete = item; // Lưu thông tin đối tượng cần xóa
    this.statusVehicle = item.vehicleStatus; // Điền trạng thái xe vào modal
  }

  handleCancelDeleteStatusVehicle(): void {
    // Đóng modal xóa
    this.isDeleteStatusVehicle = false;
    this.statusVehicleToDelete = null; // Xóa thông tin đối tượng cần xóa
  }

  handleSubmitDeleteStatusVehicle(): void {
    if (this.statusVehicleToDelete) {
      // Xóa trạng thái xe khỏi danh sách
      this.statusVehicleList = this.statusVehicleList.filter(
        (item) => item.id !== this.statusVehicleToDelete.id
      );

      // Cập nhật danh sách hiển thị
      this.updateDisplayedData();
      this.total = this.statusVehicleList.length; // Cập nhật tổng số mục
    }

    // Đóng modal xóa
    this.isDeleteStatusVehicle = false;
    this.statusVehicleToDelete = null;
    this.sendDataToParent();
  }
}

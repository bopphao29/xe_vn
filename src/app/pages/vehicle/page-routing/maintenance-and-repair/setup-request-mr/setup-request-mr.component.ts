import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CarStatusComponent } from './car-status/car-status.component';
import { ItemCheckComponent } from './item-check/item-check.component';
import { WorkPerformedComponent } from './work-performed/work-performed.component';
import { ReplacementSuppliesComponent } from "./replacement-supplies/replacement-supplies.component";
import { VehicalServiceService } from '../../../../../shared/services/vehical-service.service';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { DONTANYTHING } from '../../../../../shared/constants/common.const';
import Swal from 'sweetalert2';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { ValidateIntoPageService } from '../../../../../shared/services/validate-into-page.service';


@Component({
  selector: 'app-setup-request-mr',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    TranslateModule,
    NzTabsModule,
    NzSelectModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzDatePickerModule,
    NzUploadModule,
    NzIconModule,
    NzRadioModule,
    NzModalModule,
    CarStatusComponent,
    ItemCheckComponent,
    WorkPerformedComponent,
    ReplacementSuppliesComponent,
    NzTimePickerModule,
    NzPaginationModule
],
  templateUrl: './setup-request-mr.component.html',
  styleUrl: './setup-request-mr.component.scss'
})
export class SetupRequestMrComponent implements OnInit{
  @Output() dataEmmitter = new EventEmitter<string>()

  routerLink(){
    this.dataEmmitter.emit('setup-request')
  }

  form !: FormGroup
  constructor(
    private fb : FormBuilder,
    private vehicleService: VehicalServiceService,
    private notification: NotificationService,
    private validateService : ValidateIntoPageService
    
  ){}

  
  ngOnInit(): void {
    this.form = this.fb.group(
      {
        routeId: [null, Validators.required],
        id: null,
        registerNo: [null, Validators.required],
        driverName: [null, Validators.required],
        phoneNumber: [null, Validators.required],
        latestOdometer: [null, Validators.required],
        latestDate: [null, Validators.required],
        currentOdometer: [null, Validators.required],
        levelMaintenance: [null, Validators.required],
        supposedStartTime: [null, Validators.required],
        supposedStartDate: [null, Validators.required],
        supposedEndTime: [null, Validators.required],
        supposedEndDate: [null, Validators.required],
        maintenanceFacilityId: [null, Validators.required],
        approvalStatus: 1,
        priorityStatus: 0,
        status: 1,
        note: null,
        lstTestCategories: [
          {
            name: null
          },
        ],
        lstVehicleStatus: [
          {
            name: null
          }
        ],
        lstWorkPerformed: [
          {
            name: null
          }
        ],
        lstReplacementSupplies: [
          {
            supplyId: null,
            quantity: null,
            unit: null
          },
        ]
      }

      
    )

    this.getRoute()
    this.showListForMaintenance()
    this.getAllForMaintenance()
    this.getMaintenanceFacilities()

    this.form.get('registerNo')?.valueChanges.subscribe((registerNoId) => {
      const selectedData = this.listForMaintenance.find(data => data.id === registerNoId);
      
      if (selectedData) {
        this.form.patchValue({
          driverName: selectedData.driverName,
          phoneNumber: selectedData.phoneNumber,
        });
      } else {
        this.form.patchValue({
          driverName: '',
          phoneNumber: '',
        });
      }
    });
  }

  
  vehicleStatus: { name: string }[] = [];
  itemCheck: { name: string }[] = [];
  workPerformed: { name: string }[] = [];
  replacementSupplies: {supplyId: number; quantity: number;  unit: string }[] = [];
receiveData(data: any[], name: string): void {
  // Trích xuất và chuyển đổi dữ liệu thành { name: "..." }
  const processedData = data.map(item => ({ name: item[name] }));
  const processedDataRS = data.map(item => ({ supplyId: item['supplyId'],  quantity: item['quantity'], unit: item['unit']}));
  // Thay thế mảng hiện tại với mảng mới từ con
  if (name === 'vehicleStatus') {
    this.vehicleStatus = processedData; // Thay thế mảng vehicleStatus
  } else if (name === 'itemCheck') {
    this.itemCheck = processedData; // Thay thế mảng itemCheck
  } else if(name === 'itemCheck'){
    this.workPerformed = processedData; // Thay thế mảng workPerformed
  }else{
    this.replacementSupplies = processedDataRS
  }

  // Kiểm tra kết quả
}

validateNumber(name:string , event : Event){
  this.validateService.validateNumber(this.form, name, event)
}
validateText(path: string | (string | number)[], event: Event) {
  this.validateService.validateText(this.form, path, event)
}

  listRoute : any[] =[]
  getRoute(){
    this.vehicleService.getRoute().subscribe((response : any)=> {
      this.listRoute = response.data

    })
  }

  pageIndex = 1
  pageSize = 9
  total = 1

  listForMaintenance : any[] =[]  
  listForMaintenanceCopy : any[] =[]  
  listMaintenanceFacilities: any[] = []
  getMaintenanceFacilities(){
    this.vehicleService.getMaintenanceFacilities().subscribe((response: any)=>{
        this.listMaintenanceFacilities = response.data
      })
    }

  getAllForMaintenance(){
    this.vehicleService.getForMaintenance(0, 1000).subscribe((response : any) => {
      this.listForMaintenanceCopy = response.data?.content
    })
  }
  
  getForMaintenance(page: number, size: number){
    this.vehicleService.getForMaintenance(page, size).subscribe((response : any) => {
      this.listForMaintenance = response.data?.content
      this.total = response.data.totalElements
      console.log(response)
      if(response.data.totalElements == 0){
              Swal.fire({
                icon: "warning",
                // title: "......",
                text: "Không tìm thấy dữ liệu bạn muốn tìm kiếm!",
                // timer: 3000
              });
            }

    })
  }

  showListForMaintenance(){
      const page = this.pageIndex - 1 < 0 ? 0 : this.pageIndex - 1 
      const size = 9
    
    this.getForMaintenance(page, size)
  }
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.showListForMaintenance()
  }

  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.form.get('priorityStatus')?.setValue(isChecked ? 0 : 1); 
  }

  showNoDataForMaintenance(){
    const numberData = 9
    const data = {registerNo: null, driver: null, phoneNumber: null, maintenanceKm: null}
    
    const dataRrows = this.listForMaintenance.slice();
    const currentData = dataRrows.length
    if(currentData < numberData){
      const isChangeData = numberData - currentData
      for(let i = 0; i < isChangeData; i++){
        dataRrows.push(data)
      }
    }
    return dataRrows;
  }


  disableBeforeDate(name: string): (beforeDate: Date | null) => boolean {
    return (beforeDate: Date | null): boolean => {
      if (!beforeDate || !this.form) return false;
  
      const afterDate = this.form.get(name)?.value;
      if (!afterDate) return false;
  
      const AfterDateObject = new Date(afterDate);
  
      return beforeDate <= AfterDateObject;
    };
  }
  
  disableAfterDate(name: string): (afterDate: Date | null) => boolean {
    return (afterDate: Date | null): boolean => {
      if (!afterDate || !this.form) return false;
  
      const beforeDate = this.form.get(name)?.value;
      if (!beforeDate) return false;
  
      const beforeDateObject = new Date(beforeDate);
  
      return afterDate >= beforeDateObject;
    };
  }
  

  onSelectRow(data: any): void {
    const selectedItem = this.listForMaintenance.find(item => item.registerNo === data.registerNo);
  
    if (selectedItem) {
      this.form.patchValue({
        registerNo: selectedItem.id, // Patch ID để khớp với nzValue
        driverName: data.driverName,
        phoneNumber: data.phoneNumber,
      });
    }
  }
  
  formatTime(time: any): string {
    if (time) {
      // Kiểm tra nếu là đối tượng Moment hoặc Date
      const hours = time.hours ? time.hours : time.getHours();
      const minutes = time.minutes ? time.minutes : time.getMinutes();

      const formattedHours = hours < 10 ? '0' + hours : hours;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

      return `${formattedHours}:${formattedMinutes}:00`;
    }
    return '';
  }

  resNo = ""
  onSubmit(){
    
    this.form.markAllAsTouched()
    const supposedStartTime = this.formatTime(this.form.value.supposedStartTime);
      const supposedEndTime = this.formatTime(this.form.value.supposedEndTime);
    if(this.form.invalid){
      this.notification.error('Kiểm tra lại trường bắt buộc')
    }
    else{
      const registerNo = this.form.get('registerNo')?.value;
      const selectedVehicle = this.listForMaintenance.find(data => data.id === registerNo);
      if (selectedVehicle) {
        this.resNo = selectedVehicle.registerNo
      }
      const dataFrom = {
        ...this.form.value,
        supposedStartTime: supposedStartTime,
        supposedEndTime : supposedEndTime,
        registerNo: this.resNo,
        lstVehicleStatus: this.vehicleStatus,
        lstTestCategories: this.itemCheck,
        lstWorkPerformed: this.workPerformed,
        lstReplacementSupplies: this.replacementSupplies
      }

      this.vehicleService.maintenanceRepairSchedules(dataFrom).subscribe({
        next : (response: any) => {
          this.notification.success('Thiết lập BDSC thành công  ')
        },
        error: (error: any)=>{
          this.notification.error('Có lỗi xảy ra')
        }
      })
    }
  }



}

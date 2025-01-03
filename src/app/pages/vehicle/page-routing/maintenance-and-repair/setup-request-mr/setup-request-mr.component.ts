import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { DatePipe } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CarStatusComponent } from './car-status/car-status.component';
import { ItemCheckComponent } from './item-check/item-check.component';
import { WorkPerformedComponent } from './work-performed/work-performed.component';
import { ReplacementSuppliesComponent } from './replacement-supplies/replacement-supplies.component';
import { VehicalServiceService } from '../../../../../shared/services/vehical-service.service';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { DONTANYTHING } from '../../../../../shared/constants/common.const';
import Swal from 'sweetalert2';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { ValidateIntoPageService } from '../../../../../shared/services/validate-into-page.service';
import { ActivatedRoute } from '@angular/router';

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
    NzPaginationModule,
  ],
  providers: [DatePipe],
  templateUrl: './setup-request-mr.component.html',
  styleUrl: './setup-request-mr.component.scss',
})
export class SetupRequestMrComponent implements OnInit {
  @Output() dataEmmitter = new EventEmitter<string>();

  routerLink() {
    this.dataEmmitter.emit('setup-request');
  }

  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicalServiceService,
    private notification: NotificationService,
    private validateService: ValidateIntoPageService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {}

  id: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      console.log(this.id);
      // this.getDetailMR(this.id)
    });

    this.form = this.fb.group({
      routeId: [null, Validators.required],
      id: null,
      registerNo: [null, Validators.required],
      driver: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      latestOdometer: [null],
      latestDate: [null],
      currentOdometer: [null, Validators.required],
      levelMaintenance: [null, Validators.required],
      supposedStartTime: [null, Validators.required],
      supposedStartDate: [null, Validators.required],
      supposedEndTime: [null, Validators.required],
      supposedEndDate: [null, Validators.required],
      maintenancePlace: [null, Validators.required],
      approvalStatus: 1,
      priorityStatus: 0,
      status: 1,
      note: null,
      lstTestCategories: [
        {
          name: null,
        },
      ],
      lstVehicleStatus: [
        {
          name: null,
        },
      ],
      lstWorkPerformed: [
        {
          name: null,
        },
      ],
      lstReplacementSupplies: [
        {
          supplyId: null,
          quantity: null,
          unit: null,
        },
      ],
    });

    if (this.id) {
      this.getDetailMR(this.id);
    }

    this.getRoute();
    this.supplies();
    this.getMaintenanceFacilities();

    this.form.get('registerNo')?.valueChanges.subscribe((registerNoId) => {
      const selectedData = this.listForMaintenanceCopy.find(
        (data) => data.id === registerNoId
      );
      console.log(selectedData);
      if (selectedData) {
        this.form.patchValue({
          driver: selectedData.driverName,
          phoneNumber: selectedData.phoneNumber,
          latestOdometer: selectedData.latestMaintenanceOdometer,
          latestDate: selectedData.latestMaintenanceDate,
          currentOdometer: selectedData.currentOdometer,
        });
      } else {
        this.form.patchValue({
          driver: '',
          phoneNumber: '',
        });
      }
    });
  }

  vehicleStatus: { name: string }[] = [];
  testItem: { name: string }[] = [];
  workPerformed: { name: string }[] = [];
  replacementSupplies: { supplyId: number; quantity: number; unit: string }[] =
    [];
  receiveData(data: any[], name: string): void {
    // Trích xuất và chuyển đổi dữ liệu thành { name: "..." }
    const processedData = data.map((item) => ({ name: item[name] }));
    const processedDataRS = data.map((item) => ({
      supplyId: item['supplyId'],
      quantity: item['quantity'],
      unit: item['unit'],
    }));
    // Thay thế mảng hiện tại với mảng mới từ con
    if (name === 'vehicleStatus') {
      this.vehicleStatus = processedData; // Thay thế mảng vehicleStatus
    } else if (name === 'testItem') {
      this.testItem = processedData; // Thay thế mảng itemCheck
    } else if (name === 'workPerformed') {
      this.workPerformed = processedData; // Thay thế mảng workPerformed
    } else {
      this.replacementSupplies = processedDataRS;
    }

    // Kiểm tra kết quả
  }

  validateNumber(name: string, event: Event) {
    this.validateService.validateNumber(this.form, name, event);
  }
  validateText(path: string | (string | number)[], event: Event) {
    this.validateService.validateText(this.form, path, event);
  }

  listRoute: any[] = [];
  Idroute: any;
  getRoute() {
    this.vehicleService.getRoute().subscribe((response: any) => {
      this.listRoute = response.data;
    });
    this.form.get('routeId')?.valueChanges.subscribe((value: any) => {
      this.Idroute = value ? value : null;
      if (this.Idroute) {
        this.form.get('driver')?.setValue(null);
        this.form.get('registerNo')?.setValue(null);
        this.form.get('phoneNumber')?.setValue(null);
        this.form.get('latestOdometer')?.setValue(null);
        this.form.get('latestDate')?.setValue(null);
        this.form.get('currentOdometer')?.setValue(null);
        this.showListForMaintenance();
      } else {
        console.log('');
      }
    });
  }

  pageIndex = 1;
  pageSize = 9;
  total = 1;

  listForMaintenance: any[] = [];
  listForMaintenanceCopy: any[] = [];
  listMaintenanceFacilities: any[] = [];

  supplies() {
    this.vehicleService.supplies().subscribe((response: any) => {
      console.log(response);
    });
  }

  formattedString: any;
  getMaintenanceFacilities() {
    this.vehicleService
      .getMaintenanceFacilities()
      .subscribe((response: any) => {
        this.listMaintenanceFacilities = response.data.map((item: string) => ({
          value: item,
        }));
        console.log(this.listMaintenanceFacilities);
      });
  }

  inforMR: any;
  listVS: any[] = [];
  listWP: any[] = [];
  lstRS: any[] = [];
  lstTC: any[] = [];

  getForMaintenance(page: number, size: number) {
    this.vehicleService
      .getForMaintenance(page, size, this.Idroute)
      .subscribe((response: any) => {
        this.listForMaintenanceCopy = response.data?.content;
        this.total = response.data.totalElements;
        this.vehicleService
          .getForMaintenance(page, this.total, this.Idroute)
          .subscribe((response: any) => {
            this.listForMaintenance = response.data?.content;
            console.log(this.listForMaintenance);
          });
        if (response.data.totalElements == 0) {
          Swal.fire({
            icon: 'warning',
            // title: "......",
            text: 'Không tìm thấy dữ liệu bạn muốn tìm kiếm!',
            // timer: 3000
          });
        }
      });
  }

  getDetailMR(id: number) {
    this.vehicleService.getDetailMR(id).subscribe((response: any) => {
      this.inforMR = response.data;
      this.listVS = response.data.lstVehicleStatus;
      this.listWP = response.data.lstWorkPerformed;
      this.lstRS = response.data.lstReplacementSupplies;
      this.lstTC = response.data.lstTestCategories;

      this.cdr.detectChanges();
      console.log(this.listVS);
      // this.form.patchValue(response.data)
      const supposedStartTime = this.convertStringToDate(
        response.data.supposedStartTime
      );
      const supposedEndTime = this.convertStringToDate(
        response.data.supposedEndTime
      );

      const matchedFacility = this.listForMaintenanceCopy.find(
        (facility) => facility.registerNo === response.data.registerNo
      );
      console.log(this.listForMaintenanceCopy);
      // Nếu tìm thấy, patch giá trị registerId vào form
      if (matchedFacility) {
        console.log(matchedFacility);
        this.form.get('registerNo')?.setValue(matchedFacility.id);
      }

      this.form.patchValue({
        routeId: response.data.routeId,
        driver: response.data.driver,
        phoneNumber: response.data.phoneNumber,
        latestOdometer: response.data.latestOdometer,
        latestDate: response.data.latestDate,
        currentOdometer: response.data.currentOdometer,
        levelMaintenance: response.data.levelMaintenance,
        supposedStartTime: supposedStartTime,
        supposedStartDate: response.data.supposedStartDate,
        supposedEndTime: supposedEndTime,
        supposedEndDate: response.data.supposedEndDate,
        maintenancePlace: response.data.maintenancePlace,
        approvalStatus: response.data.approvalStatus,
        priorityStatus: response.data.priorityStatus,
        status: response.data.status,
        note: response.data.note,
      });

      console.log(response.data.supposedStartTime);
      // this.form.get('supposedStartTime')?.setValue(response.data.supposedStartTime)
    });
  }

  convertStringToDate(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date;
  }

  cancelFix() {}

  showListForMaintenance() {
    const page = this.pageIndex - 1 < 0 ? 0 : this.pageIndex - 1;
    const size = 9;
    console.log(this.Idroute);
    this.getForMaintenance(page, size);
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.showListForMaintenance();
  }

  priorityStatus: number = 0;

  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.priorityStatus = isChecked ? 1 : 0;
  }

  showNoDataForMaintenance() {
    const numberData = 9;
    const data = {
      registerNo: null,
      driver: null,
      phoneNumber: null,
      maintenanceKm: null,
    };

    const dataRrows = this.listForMaintenanceCopy.slice();
    const currentData = dataRrows.length;
    if (currentData < numberData) {
      const isChangeData = numberData - currentData;
      for (let i = 0; i < isChangeData; i++) {
        dataRrows.push(data);
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
    const selectedItem = this.listForMaintenanceCopy.find(
      (item) => item.registerNo === data.registerNo
    );
    console.log(selectedItem);
    if (selectedItem) {
      this.form.patchValue({
        registerNo: selectedItem.id, // Patch ID để khớp với nzValue
        driver: data.driverName,
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

  resNo = '';
  onSubmit() {
    this.form.markAllAsTouched();
    const supposedStartTime = this.formatTime(
      this.form.value.supposedStartTime
    );
    const supposedEndTime = this.formatTime(this.form.value.supposedEndTime);
    if (this.form.invalid) {
      this.notification.error('Kiểm tra lại trường bắt buộc');
    } else {
      const registerNo = this.form.get('registerNo')?.value;
      const selectedVehicle = this.listForMaintenance.find(
        (data) => data.id === registerNo
      );
      if (selectedVehicle) {
        this.resNo = selectedVehicle.registerNo;
      }
      const formmatDate = 'yyyy-MM-dd';

      const supposedEndDate = this.form.get('supposedEndDate')?.value;
      const supposedStartDate = this.form.get('supposedStartDate')?.value;
      console.log(this.form.get('priorityStatus')?.value);
      const dataFrom = {
        ...this.form.value,
        priorityStatus: this.form.get('priorityStatus')?.value === true ? 1 : 0,
        id: this.id ? Number(this.id) : null,
        supposedStartTime: supposedStartTime,
        supposedEndTime: supposedEndTime,
        supposedEndDate: this.datePipe.transform(supposedEndDate, formmatDate),
        supposedStartDate: this.datePipe.transform(
          supposedStartDate,
          formmatDate
        ),
        registerNo: this.resNo,
        lstVehicleStatus: this.vehicleStatus,
        lstTestCategories: this.testItem,
        lstWorkPerformed: this.workPerformed,
        lstReplacementSupplies: this.replacementSupplies,
      };

      if (this.id) {
        this.vehicleService
          .chageMaintenanceRepairSchedules(dataFrom)
          .subscribe({
            next: (response: any) => {
              this.notification.success('Sửa yêu cầu BDSC thành công!');
            },
            error: (error: any) => {
              this.notification.error('Có lỗi xảy ra');
            },
          });
      } else {
        this.vehicleService.maintenanceRepairSchedules(dataFrom).subscribe({
          next: (response: any) => {
            this.notification.success('Thiết lập BDSC thành công!');
          },
          error: (error: any) => {
            this.notification.error('Có lỗi xảy ra');
          },
        });
      }
    }
  }
}

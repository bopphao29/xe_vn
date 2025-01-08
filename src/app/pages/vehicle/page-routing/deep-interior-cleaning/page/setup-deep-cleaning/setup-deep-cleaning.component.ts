import { CommonModule, DatePipe } from '@angular/common';
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
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../../shared/services/notification.service';
import { ValidateIntoPageService } from '../../../../../../shared/services/validate-into-page.service';
import { VehicalServiceService } from '../../../../../../shared/services/vehical-service.service';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { ItemCheckComponent } from './item-check/item-check.component';
import { WorkPerformedComponent } from './work-performed/work-performed.component';
import { CarStatusComponent } from './car-status/car-status.component';

@Component({
  selector: 'app-setup-deep-cleaning',
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
    ItemCheckComponent,
    WorkPerformedComponent,
    CarStatusComponent,
    NzTimePickerModule,
    NzPaginationModule,
  ],
  providers: [DatePipe],
  templateUrl: './setup-deep-cleaning.component.html',
  styleUrl: './setup-deep-cleaning.component.scss',
})
export class SetupDeepCleaningComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicalServiceService,
    private notification: NotificationService,
    private validateService: ValidateIntoPageService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private routes: Router
  ) {}

  @Output() dataEmmitter = new EventEmitter<string>();

  routerLink() {
    this.dataEmmitter.emit('setupDCL');
  }

  id: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      console.log(this.id);
      // this.getDetailMR(this.id)
    });

    this.checkIsFromRequestMr();

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

    this.getRoute();
    this.supplies();
    this.getMaintenanceFacilities();

    this.form.get('driver')?.disable();
    this.form.get('phoneNumber')?.disable();
    this.form.get('currentOdometer')?.disable();

    this.form.get('registerNo')?.valueChanges.subscribe((registerNo) => {
      const selectedData = this.listForMaintenanceCopy.find(
        (data) => data.registerNo === registerNo
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
      }
    });

    if (this.id) {
      this.getDetailMR(this.id);
    }
  }

  supplies() {
    this.vehicleService.supplies().subscribe((response: any) => {
      console.log(response);
    });
  }

  isFromRequestMr: boolean = false;
  priorityStatus: number = 0;

  checkIsFromRequestMr() {
    const state = history.state;
    if (state && state.isFromRequestMr) {
      this.isFromRequestMr = state.isFromRequestMr;
    }
  }

  cancelFix() {
    window.history.back(); //need to check
  }

  vehicleStatus: { name: string }[] = [];
  testItem: { name: string }[] = [];
  workPerformed: { name: string }[] = [];

  inforMR: any;
  listVS: any[] = [];
  listWP: any[] = [];
  lstRS: any[] = [];
  lstTC: any[] = [];
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
    } else {
      this.workPerformed = processedData; // Thay thế mảng workPerformed
    }

    // Kiểm tra kết quả
  }

  listMaintenanceFacilities: any[] = [];

  getMaintenanceFacilities() {
    this.vehicleService
      .getMaintenanceFacilities()
      .subscribe((response: any) => {
        this.listMaintenanceFacilities = response.data.map((item: string) => ({
          value: item,
        }));
      });
  }

  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.priorityStatus = isChecked ? 1 : 0;
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

  showListForMaintenance() {
    const page = this.pageIndex - 1 < 0 ? 0 : this.pageIndex - 1;
    const size = 9;
    console.log(this.Idroute);
    this.getForMaintenance(page, size);
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

  listForMaintenanceCopy: any[] = [];
  listForMaintenance: any[] = [];
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

  pageIndex = 1;
  pageSize = 9;
  total = 1;

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.showListForMaintenance();
  }

  convertStringToDate(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date;
  }

  getDetailMR(id: number) {
    this.vehicleService.getDetailMR(id, 1).subscribe((response: any) => {
      // this.inforMR = response.data;
      // this.listVS = response.data.lstVehicleStatus;
      // this.listWP = response.data.lstWorkPerformed;
      // this.lstRS = response.data.lstReplacementSupplies;
      // this.lstTC = response.data.lstTestCategories;

      this.cdr.detectChanges();
      // this.form.patchValue(response.data)
      const supposedStartTime = this.convertStringToDate(
        response.data.supposedStartTime
      );
      const supposedEndTime = this.convertStringToDate(
        response.data.supposedEndTime
      );

      this.form.patchValue({
        routeId: response.data.routeId,
        driver: response.data.driver,
        registerNo: response.data.registerNo,
        phoneNumber: response.data.phoneNumber,
        latestOdometer: response.data.latestOdometer,
        latestDate: response.data.latestDate,
        currentOdometer: response.data.currentOdometer,
        levelMaintenance: response.data.levelMaintenance.toString(),
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

      // this.form.patchValue(response.data)
    });
  }

  onBack(event: any) {
    this.routes.navigate(['vehicle/detail-deep-cleaning/' + this.id]);
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

  onSubmit() {
    this.form.markAllAsTouched();
    // const dsts = this.form.getRawValue()
    const supposedStartTime = this.formatTime(
      this.form.value.supposedStartTime
    );
    const supposedEndTime = this.formatTime(this.form.value.supposedEndTime);
    if (this.form.invalid) {
      this.notification.error('Kiểm tra lại trường bắt buộc');
    } else {
      const formmatDate = 'yyyy-MM-dd';

      const supposedEndDate = this.form.get('supposedEndDate')?.value;
      const supposedStartDate = this.form.get('supposedStartDate')?.value;
      console.log(this.form.get('priorityStatus')?.value);
      const dataFrom = {
        ...this.form.getRawValue(),
        priorityStatus: this.form.get('priorityStatus')?.value === true ? 1 : 0,
        id: this.id ? Number(this.id) : null,
        supposedStartTime: supposedStartTime,
        supposedEndTime: supposedEndTime,
        supposedEndDate: this.datePipe.transform(supposedEndDate, formmatDate),
        supposedStartDate: this.datePipe.transform(
          supposedStartDate,
          formmatDate
        ),
        lstVehicleStatus: this.vehicleStatus,
        lstTestCategories: this.testItem,
        lstWorkPerformed: this.workPerformed,
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

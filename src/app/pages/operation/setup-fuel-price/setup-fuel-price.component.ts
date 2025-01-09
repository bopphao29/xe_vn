import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SetupOperationPopupDetailComponent } from '../setup-operation/route/popup-detail/popup-detail.component';
import { API_CODE } from '../../../shared/constants/common.const';
import { DialogService } from '../../../shared/services/dialog.service';
import { ExtendService } from '../vehicle-command/extend/extend.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ValidateIntoPageService } from '../../../shared/services/validate-into-page.service';
import { TranslateModule } from '@ngx-translate/core';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PopupUpdateFuelPriceComponent } from './popup-update/popup-update.component';
import { SetupFuelService } from './setup-fuel.service';

@Component({
  selector: 'app-setup-fuel-price',
  templateUrl: './setup-fuel-price.component.html',
  styleUrls: ['./setup-fuel-price.component.scss'],
  standalone: true,
  imports: [
    NzSelectModule,
    ReactiveFormsModule,
    CommonModule,
    NzToolTipModule,
    NzTableModule,
    NzPaginationModule,
    NzInputModule,
    NzDatePickerModule,
    TranslateModule,
    NzTimePickerModule,
    ButtonComponent,
  ],
})
export class SetupFuelPriceComponent {
  listRoute: Array<{ id: any; value: any }> = [];
  listData: any = [];
  paginate = {
    page: 1,
    size: 12,
  };
  total = 0;
  pagedData: any[] = [];
  listFake = [1];
  form!: FormGroup;
  searchForm!: FormGroup;

  region: Array<any> = [1, 2, 3];

  constructor(
    private fb: FormBuilder,
    private dialogSrv: DialogService,
    private routeSrv: ExtendService,
    private notification: NotificationService,
    private fuelSrv: SetupFuelService
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.getListRoute();
    this.search();
  }

  loadForm() {
    this.form = this.fb.group({
      applyDate: [null, Validators.required],
      applyTime: [null, Validators.required],
      fuelPrices: this.fb.array(this.region.map(() => this.createFuelPrice())),
    });

    this.searchForm = this.fb.group({
      startDate: [null],
      endDate: [null],
    });
  }

  createFuelPrice(): FormGroup {
    return this.fb.group({
      // region: ['', Validators.required],
      ron92: ['', Validators.required],
      ron95: ['', Validators.required],
      diesel005: ['', Validators.required],
      diesel0001: ['', Validators.required],
    });
  }

  get fuelPrices(): FormArray {
    return this.form.get('fuelPrices') as FormArray;
  }

  getListRoute() {
    this.routeSrv.getListRoute().subscribe((res) => {
      if (res && res.code === API_CODE.SUCCESS) {
        this.listRoute = res.data.map((ele: any) => {
          return {
            id: ele.id,
            value: ele.name,
          };
        });
      }
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.notification.error('Vui lòng điền đầy đủ thông tin');
      return;
    } else {
      this.createItinerary();
    }
  }

  createItinerary() {
    const body: any = [];

    this.form.value.fuelPrices.map((ele: any, index: number) => {
      const fuel = {
        ron92: +ele.ron92,
        ron95: +ele.ron95,
        diesel005: +ele.diesel005,
        diesel0001: +ele.diesel0001,
        region: index + 1,
        applyDate: this.formatDate(this.form.value.applyDate),
        applyTime: this.formatTime(this.form.value.applyTime),
      };
      body.push(fuel);
    }),
      this.fuelSrv.createFuelPrice(body).subscribe((res) => {
        if (res && res.code == 201) {
          this.notification.success(res.message);
          this.form.reset();
          this.search();
        }
      });
  }

  formatDate(isoDateString: string) {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatTime(isoDateString: string) {
    const date = new Date(isoDateString);

    // Chuyển đổi giờ về múi giờ mong muốn (ví dụ: UTC+7, nếu cần)
    const targetHours = 9; // Giờ cố định 09
    const hours = String(targetHours).padStart(2, '0');
    const minutes = '00';
    const seconds = '00';

    return `${hours}:${minutes}:${seconds}`;
  }

  validateText(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  viewDetail(data: any) {
    const dialogData = {
      data: data,
      title: 'Thiết lập giá nhiên liệu',
    };

    const dialogRef = this.dialogSrv.openDialog(
      PopupUpdateFuelPriceComponent,
      '',
      dialogData,
      {
        nzClosable: true,
        nzWidth: '1064px',
        nzCentered: true,
        nzClassName: 'custom-modal',
      }
    );

    dialogRef.afterClose.subscribe(() => {
      this.search();
    });
  }

  onPageChange(page: number): void {
    this.paginate.page = page;
    this.search();
  }

  search() {
    const body = this.searchForm.value;
    this.fuelSrv.getListFuelsPrice(body).subscribe((res) => {
      if (res && res.code === API_CODE.SUCCESS) {
        this.listData = res.data.content;
        this.total = res.data.totalElements;
        console.log(this.listData);
      }
    });
  }
}

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

  constructor(
    private fb: FormBuilder,
    private dialogSrv: DialogService,
    private routeSrv: ExtendService,
    private notification: NotificationService,
    private validateService: ValidateIntoPageService
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.getListRoute();
    this.search();
  }

  loadForm() {
    this.form = this.fb.group({
      bks: [null, Validators.required],
      reason: ['', Validators.required],
      endTime: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      startDate: ['', Validators.required],
      reinforcedRoute: ['', Validators.required],
      currentQuota: ['', Validators.required],
      phone: ['', Validators.required],
      driverName: ['', Validators.required],
    });
  }

  get stopPoints(): FormArray {
    return this.form.get('stopPoints') as FormArray;
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
      // this.notification.error('Vui lòng điền đầy đủ thông tin');
      return;
    } else {
      this.createItinerary();
    }
  }

  createItinerary() {
    const body = {
      ...this.form.value,
      stopPoints: this.form.value.stopPoints.map((ele: any, index: number) => {
        return {
          ...ele,
          itineraryId: index + 1,
        };
      }),
    };
    this.routeSrv.createItinerary(body).subscribe((res) => {
      if (res && res.code === API_CODE.SUCCESS) {
        this.notification.success(res.message);
        this.form.reset();
        this.search();
      }
    });
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
    this.routeSrv.getAllItinerary().subscribe((res) => {
      if (res && res.code === API_CODE.SUCCESS) {
        this.listData = res.data.content;
        this.total = res.data.totalElements;
      }
    });
  }
}

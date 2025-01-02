import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ValidateIntoPageService } from '../../../../shared/services/validate-into-page.service';
import { CommonModule } from '@angular/common';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogService } from '../../../../shared/services/dialog.service';
import { API_CODE } from '../../../../shared/constants/common.const';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ExtendService } from './extend.service';
import { SetupOperationPopupDetailComponent } from '../../setup-operation/route/popup-detail/popup-detail.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-extend-vehicle',
  templateUrl: './extend.component.html',
  styleUrls: ['./extend.component.scss'],
  standalone: true,
  imports: [
    NzSelectModule,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    NzToolTipModule,
    NzTableModule,
    NzPaginationModule,
    NzInputModule,
    NzDatePickerModule,
  ],
})
export class ExtendVehicleComponent implements OnInit {
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
      routeType: [null, Validators.required],
      name: ['', Validators.required],
      startPoint: ['', Validators.required],
      totalDistance: ['', Validators.required],
      completionTime: ['', Validators.required],
      endPoint: ['', Validators.required],
      runningTime: ['', Validators.required],
      distance: ['', Validators.required],
      shortestItinerary: ['', Validators.required],
      ticketPrice: ['', Validators.required],
      stopPoints: this.fb.array(
        this.listFake.map(() => this.createStopPoint())
      ),
    });
  }

  createStopPoint(): FormGroup {
    return this.fb.group({
      stopName: ['', Validators.required],
      runningTime: ['', Validators.required],
      waitingTime: ['', Validators.required],
      distance: ['', Validators.required],
      shortestItinerary: ['', Validators.required],
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
    console.log(data);
    const dialogData = {
      data: data,
    };

    const dialogRef = this.dialogSrv.openDialog(
      SetupOperationPopupDetailComponent,
      'Chi tiết lộ trình',
      dialogData,
      {
        nzClosable: true,
        nzWidth: '1152px',
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

  addFormArray() {
    this.stopPoints.push(this.createStopPoint());
  }

  removeFormArray(index: number) {
    this.stopPoints.removeAt(index);
  }
}

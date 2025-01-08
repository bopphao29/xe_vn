import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { RouteService } from '../route.service';
import { API_CODE } from '../../../../../shared/constants/common.const';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { allowOnlyNumbers } from '../../../../../shared/utilities/allowOnlyNumber';
import { formatNumber } from '../../../../../shared/utilities/formatNumber';

@Component({
  selector: 'app-setup-operation-popup-detail',
  templateUrl: './popup-detail.component.html',
  styleUrls: ['./popup-detail.component.scss'],
  standalone: true,
  imports: [
    NzSelectModule,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    NzToolTipModule,
    NzTableModule,
    NzPaginationModule,
    NzModalModule,
  ],
})
export class SetupOperationPopupDetailComponent implements OnInit {
  form!: FormGroup;

  listFake = [1];

  isEdit: boolean = false;

  data!: any;
  dataDetail!: any;
  isShowStopName: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private routeSrv: RouteService,
    private notification: NotificationService,
    @Inject(NZ_MODAL_DATA) public modalData: any
  ) {
    this.data = this.modalData.data;
  }

  ngOnInit(): void {
    this.loadForm();
    this.fillData(this.data);
  }

  fillData(data: any) {
    this.routeSrv.viewItinerary(data.id).subscribe((res) => {
      this.dataDetail = res.data;
      this.form.get('routeType')?.setValue(res.data.routeType);
      this.form.get('name')?.setValue(res.data.name);
      this.form.get('startPoint')?.setValue(res.data.startPoint);
      this.form.get('totalDistance')?.setValue(res.data.totalDistance);
      this.form.get('completionTime')?.setValue(res.data.completionTime);
      this.form.get('endPoint')?.setValue(res.data.endPoint);
      this.form.get('runningTime')?.setValue(res.data.runningTime);
      this.form.get('distance')?.setValue(res.data.distance);
      this.form.get('shortestItinerary')?.setValue(res.data.shortestItinerary);
      this.form.get('ticketPrice')?.setValue(res.data.ticketPrice);

      const stopPointsArray = this.form.get('stopPoints') as FormArray;
      res.data.stopPoints.forEach((stopPoint: any) => {
        stopPointsArray.push(this.createStopPointAndFill(stopPoint));
      });
      this.form.disable();
    });
  }

  createStopPointAndFill(stopPoint: any = {}): FormGroup {
    return this.fb.group({
      itineraryId: [stopPoint.itineraryId || '', Validators.required],
      stopName: [stopPoint.stopName || '', Validators.required],
      runningTime: [stopPoint.runningTime || '', Validators.required],
      waitingTime: [stopPoint.waitingTime || '', Validators.required],
      distance: [stopPoint.distance || '', Validators.required],
      shortestItinerary: [
        stopPoint.shortestItinerary || '',
        Validators.required,
      ],
    });
  }

  loadForm() {
    this.form = this.fb.group({
      routeType: ['', Validators.required],
      name: ['', Validators.required],
      startPoint: ['', Validators.required],
      totalDistance: ['', Validators.required],
      completionTime: ['', Validators.required],
      endPoint: ['', Validators.required],
      runningTime: ['', Validators.required],
      distance: ['', Validators.required],
      shortestItinerary: ['', Validators.required],
      ticketPrice: ['', Validators.required],
      stopPoints: this.fb.array([]),
    });
    this.form.get('routeType')?.valueChanges.subscribe((value: any) => {
      const stopPointsArray = this.form.get('stopPoints') as FormArray;
      if (value === 2) {
        this.isShowStopName = true;
        stopPointsArray.controls.forEach((group: AbstractControl) => {
          group.get('stopName')?.addValidators(Validators.required);
          group.get('stopName')?.updateValueAndValidity();
          group.get('runningTime')?.addValidators(Validators.required);
          group.get('runningTime')?.updateValueAndValidity();
          group.get('waitingTime')?.addValidators(Validators.required);
          group.get('waitingTime')?.updateValueAndValidity();
          group.get('distance')?.addValidators(Validators.required);
          group.get('distance')?.updateValueAndValidity();
          group.get('shortestItinerary')?.addValidators(Validators.required);
          group.get('shortestItinerary')?.updateValueAndValidity();
        });
      } else {
        this.isShowStopName = false;
        stopPointsArray.controls.forEach((group: AbstractControl) => {
          group.get('stopName')?.addValidators([]);
          group.get('stopName')?.updateValueAndValidity();
          group.get('runningTime')?.addValidators([]);
          group.get('runningTime')?.updateValueAndValidity();
          group.get('waitingTime')?.addValidators([]);
          group.get('waitingTime')?.updateValueAndValidity();
          group.get('distance')?.addValidators([]);
          group.get('distance')?.updateValueAndValidity();
          group.get('shortestItinerary')?.addValidators([]);
          group.get('shortestItinerary')?.updateValueAndValidity();
        });
      }
    });
  }

  createStopPoint(): FormGroup {
    return this.fb.group({
      itineraryId: [''],
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

  validateText(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  onInputChange(event: any): void {
    formatNumber(event, this.form.get('ticketPrice') as FormControl);
  }

  onKeyPress(event: any) {
    allowOnlyNumbers(event);
  }

  closeModal() {
    this.modal.close();
  }

  saveEdit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      console.log(this.form.value);
      this.notification.error('Vui lòng điền đầy đủ thông tin');
      return;
    } else {
      this.editItinerarie();
    }
  }

  editItinerarie() {
    const body = {
      ...this.form.value,
      id: this.dataDetail.id,
      stopPoints: this.dataDetail.stopPoints.map((ele: any, index: number) => {
        return {
          ...ele,
          itineraryId: ele.id,
        };
      }),
    };
    this.routeSrv.updateItinerary(this.data.id, body).subscribe((res) => {
      if (res && res.code === API_CODE.SUCCESS) {
        this.notification.success(res.message);
        this.modal.close();
      }
    });
  }

  addFormArray() {
    this.stopPoints.push(this.createStopPoint());
  }

  removeFormArray(index: number) {
    this.stopPoints.removeAt(index);
  }

  deleteItinerarie() {
    this.routeSrv.deleteItinerary(this.data.id).subscribe((res) => {
      if (res && res.code === API_CODE.SUCCESS) {
        this.notification.success(res.message);
        this.modal.close();
      }
    });
  }
}

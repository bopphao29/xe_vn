import { Component, Inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-update-fuel-price',
  templateUrl: './popup-update.component.html',
  styleUrls: ['./popup-update.component.scss'],
  standalone: true,
  imports: [
    NzModalModule,
    NzTimePickerModule,
    NzDatePickerModule,
    TranslateModule,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class PopupUpdateFuelPriceComponent implements OnInit {
  form!: FormGroup;
  region: Array<any> = [1, 2, 3];
  data = [
    {
      id: 40,
      code: '91e26e2f-c6bc-4411-b2ca-f93e36d8e4ef',
      applyDate: '2024-12-25',
      applyTime: '09:00:00',
      region: 'Vung 1',
      ron92: 100000.0,
      ron95: 100000.0,
      diesel005: 120000.0,
      diesel0001: 150000.0,
    },
    {
      id: 41,
      code: '91e26e2f-c6bc-4411-b2ca-f93e36d8e4ef',
      applyDate: '2024-12-25',
      applyTime: '09:00:00',
      region: 'Vung 2',
      ron92: 140000.0,
      ron95: 90000.0,
      diesel005: 130000.0,
      diesel0001: 200000.0,
    },
    {
      id: 42,
      code: '91e26e2f-c6bc-4411-b2ca-f93e36d8e4ef',
      applyDate: '2024-12-25',
      applyTime: '09:00:00',
      region: 'Vung 3',
      ron92: 130000.0,
      ron95: 110000.0,
      diesel005: 120000.0,
      diesel0001: 150000.0,
    },
  ];

  constructor(
    @Inject(NZ_MODAL_DATA) public modalData: any,
    private fb: FormBuilder,
    private modelRef: NzModalRef
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.fillData();
  }

  loadForm() {
    this.form = this.fb.group({
      applyDate: [null, Validators.required],
      applyTime: [null, Validators.required],
      fuelPrices: this.fb.array(this.region.map(() => this.createFuelPrice())),
    });
  }

  fillData(): void {
    const fuelDataArray = [
      {
        id: 40,
        code: '91e26e2f-c6bc-4411-b2ca-f93e36d8e4ef',
        applyDate: '2024-12-25',
        applyTime: '09:00:00',
        region: 'Vung 1',
        ron92: 100000.0,
        ron95: 100000.0,
        diesel005: 120000.0,
        diesel0001: 150000.0,
      },
      {
        id: 41,
        code: '91e26e2f-c6bc-4411-b2ca-f93e36d8e4ef',
        applyDate: '2024-12-25',
        applyTime: '09:00:00',
        region: 'Vung 2',
        ron92: 140000.0,
        ron95: 90000.0,
        diesel005: 130000.0,
        diesel0001: 200000.0,
      },
      {
        id: 42,
        code: '91e26e2f-c6bc-4411-b2ca-f93e36d8e4ef',
        applyDate: '2024-12-25',
        applyTime: '09:00:00',
        region: 'Vung 3',
        ron92: 130000.0,
        ron95: 110000.0,
        diesel005: 120000.0,
        diesel0001: 150000.0,
      },
    ];

    if (fuelDataArray.length > 0) {
      const dateTimeString = `${fuelDataArray[0].applyDate}T${fuelDataArray[0].applyTime}`;
      const dateTime = new Date(dateTimeString);
      this.form.get('applyDate')?.setValue(fuelDataArray[0].applyDate);
      this.form.get('applyTime')?.setValue(new Date(dateTime));
      this.form.get('applyDate')?.updateValueAndValidity();
      this.form.get('applyTime')?.updateValueAndValidity();
    }

    const fuelPricesArray = this.fuelPrices;
    fuelPricesArray.clear();

    fuelDataArray.forEach((fuelData) => {
      fuelPricesArray.push(
        this.fillFuelPrice({
          ron92: fuelData.ron92,
          ron95: fuelData.ron95,
          diesel005: fuelData.diesel005,
          diesel0001: fuelData.diesel0001,
        })
      );
    });
  }

  fillFuelPrice(data: any = {}): FormGroup {
    return this.fb.group({
      ron92: [data.ron92 || '', Validators.required],
      ron95: [data.ron95 || '', Validators.required],
      diesel005: [data.diesel005 || '', Validators.required],
      diesel0001: [data.diesel0001 || '', Validators.required],
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

  validateText(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  closeModal() {
    this.modelRef.close();
  }

  onDelete() {}

  onEdit() {}
}

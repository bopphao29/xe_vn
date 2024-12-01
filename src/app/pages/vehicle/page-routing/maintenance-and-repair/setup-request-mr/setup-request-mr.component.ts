import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    ReplacementSuppliesComponent
],
  templateUrl: './setup-request-mr.component.html',
  styleUrl: './setup-request-mr.component.scss'
})
export class SetupRequestMrComponent implements OnInit{

  form !: FormGroup
  constructor(
    private fb : FormBuilder
  ){}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        id: null,
        registerNo: [null, Validators.required],
        driver: [null, Validators.required],
        phoneNumber: [null, Validators.required],
        latestOdometer: [null, Validators.required],
        latestDate: [null, Validators.required],
        currentOdometer: [null, Validators.required],
        levelMaintenance: [null, Validators.required],
        supposedStartTime: [null, Validators.required],
        supposedStartDate: [null, Validators.required],
        supposedEndTime: [null, Validators.required],
        supposedEndDate: [null, Validators.required],
        maintenancePlace: [null, Validators.required],
        approvalStatus: 1,
        priorityStatus: 2,
        status: 1,
        lstTestCategories: [
          {
            name: null
          }
        ],
        lstVehicleStatus: [
          {
            name: null
          },
        ],
        lstWorkPerformed: [
          {
            name: null
          },

        ],
        lstReplacementSupplies: [
          {
            supplyId: 1,
            quantity: 5,
            unit: null
          }
        ]
      }
    )
  }


  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.form.get('priorityStatus')?.setValue(isChecked ? 1 : 2); 
  }

}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { IData } from '../../models-employee/setup-profile-employee/index.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';



@Component({
  selector: 'app-detail-profile-employee',
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
    NzIconModule,
    NzRadioModule,
    NzModalModule,
    NzDatePickerModule,
    NzTabsModule,
    NzUploadModule,


  ],
  templateUrl: './detail-profile-employee.component.html',
  styleUrl: './detail-profile-employee.component.scss'
})
export class DetailProfileEmployeeComponent {

constructor(
  private fb: FormBuilder,

){
  // this.form = this.fb.group(this.data)

}

  // form: FormGroup;

  // data: IData = {
  //   name: null,
  //   yearOfBirth: null,
  //   gender: null,
  //   identifierId: null,
  //   phoneNumber: null,
  //   zalo: null,
  //   contractDuration: null,
  //   email: null,
  //   ethnicGroup: null,
  //   religion: null,
  //   professionalLevel: null,
  //   maritalStatus: null,
  //   contactPerson: null,
  //   contactPersonPhone: null,
  //   staffRelation: null,
  //   permanentAddress: null,
  //   temporaryAddress: null,
  //   contractType: null,
  //   fromDate: null,
  //   toDate: null,
  //   contractDate: null,
  //   signDate: null,
  //   contractFile: null,
  //   fileContract: null,
  //   isLimitedTime: null,
  //   branchId: 0,
  //   departmentId: null,
  //   positionId: null,
  //   routeId: null,
  //   businessCardNumber: null,
  //   bcStartDate: null,
  //   bcEndDate: null,
  //   officeId: null,
  //   bcImage: null,
  //   healthCertificate: null,
  //   hcEndDate: null,
  //   driverLicenseNumber: null,
  //   driverLicenseType: null,
  //   dlStartDate: null,
  //   dlEndDate: null,
  //   dlImage: null,
  //   lstChildren: [{
  //     name: null,
  //     yearOfBirth: null,
  //     gender: null
  //   }],
  //   lstArchivedRecords: [{
  //     name: null,
  //     code: null,
  //     type: null,
  //     file: null
  //   }],

  // }
}

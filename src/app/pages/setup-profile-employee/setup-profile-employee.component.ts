import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray,Validators  } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IData } from '../../models-employee/setup-profile-employee/index.model';

@Component({
  selector: 'app-setup-profile-employee',
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

  ],
  templateUrl: './setup-profile-employee.component.html',
  styleUrl: './setup-profile-employee.component.scss'
})
export class SetupProfileEmployeeComponent implements OnInit {

  date = null;
  isEnglish = false;
  fileList: NzUploadFile[] = [];

  form: FormGroup;

  data: IData= {
    id: null,
    code: null,
    name: null,
    yearOfBirth: null,
    gender: null,
    identifierId: null,
    phoneNumber: null,
    zalo: null,
    email: null,
    ethnicGroup: null,
    religion: null,
    professionalLevel: null,
    maritalStatus: null,
    contactPerson: null,
    contactPersonPhone: null,
    staffRelation: null,
    permanentAddress: null,
    temporaryAddress: null,
    contractType: null,
    fromDate: null,
    toDate: null,
    contractDate: null,
    signDate: null,
    fileContract: null,
    isLimitedTime: null,
    branchId: null,
    departmentId: null,
    positionId: null,
    routeId: null,
    businessCardNumber: null,
    bcStartDate: null,
    bcEndDate: null,
    bcImage: null,
    healthCertificate: null,
    hcEndDate: null,
    driverLicenseNumber: null,
    driverLicenseType: null,
    dlStartDate: null,
    dlEndDate: null,
    dlImage: null,
    status: null,
    createdBy: null,
    createdDate: null,
    lastModifiedBy: null,
    lastModifiedDate: null
  }

  file = true

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService
  ){
    this.form = this.fb.group(this.data)
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: null,
    code: null,
    name: null,
    yearOfBirth: null,
    gender: null,
    identifierId: null,
    phoneNumber: null,
    zalo: null,
    email: null,
    ethnicGroup: null,
    religion: null,
    professionalLevel: null,
    maritalStatus: null,
    contactPerson: null,
    contactPersonPhone: null,
    staffRelation: null,
    permanentAddress: null,
    temporaryAddress: null,
    contractType: null,
    fromDate: null,
    toDate: null,
    contractDate: null,
    signDate: null,
    fileContract: null,
    isLimitedTime: null,
    branchId: null,
    departmentId: null,
    positionId: null,
    routeId: null,
    businessCardNumber: null,
    bcStartDate: null,
    bcEndDate: null,
    bcImage: null,
    healthCertificate: null,
    hcEndDate: null,
    driverLicenseNumber: null,
    driverLicenseType: null,
    dlStartDate: null,
    dlEndDate: null,
    dlImage: null,
    status: null,
    createdBy: null,
    createdDate: null,
    lastModifiedBy: null,
    lastModifiedDate: null,
    newFile: null,
    documents : this.fb.array([this.createArchivedRecords()]),
    childStatus: this.fb.array([this.createChildStatus()])
    })    
    
  }

  get documents(): FormArray{
    return this.form.get('documents') as FormArray;
  }

  get childStatus(): FormArray{
    return this.form.get('childStatus') as FormArray;
  }

  createArchivedRecords(): FormGroup {
    return this.fb.group({
      driverLicenseNumber: ['', Validators.required],
      driverLicenseType: ['', Validators.required],
      nameDocument: ['', Validators.required],
      newFile: ['']
    });
  }

  createChildStatus(): FormGroup {
    return this.fb.group({
      
    });
  }

  addArchivedRecords() {
    this.documents.push(this.createArchivedRecords());
  }

  addChildStatus() {
    this.childStatus.push(this.createChildStatus());
  }

  removeArchivedRecord(index: number){
    this.documents.removeAt(index)
  }

  removeChildStatus(index: number){
    this.childStatus.removeAt(index)
  }
}

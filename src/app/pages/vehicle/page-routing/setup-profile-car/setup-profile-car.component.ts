import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { IData } from '../../../../models/setup-profile-car/index.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-setup-profile-car',
  standalone: true,
  templateUrl: './setup-profile-car.component.html',
  styleUrls: ['./setup-profile-car.component.scss'],
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
    NzModalModule
  ]
})
export class SetupProfileCarComponent implements OnInit {

  date = null;
  isEnglish = false;
  fileList: NzUploadFile[] = [];

  form: FormGroup;

  data: IData = {
    id: null,
    registerNo: null,
    frameNumber: null,
    machineNumber: null,
    manufacturer: null,
    vehicleTypeId: null,
    capacity: null,
    image: null,
    intendedUse: null,
    routeId: null,
    odometer: null,
    firstStartDate: null,
    subscriptionDate: null,
    registrationDate: null,
    registrationExpireDate: null,
    tndsInsuranceStartDate: null,
    tndsInsuranceEndDate: null,
    materialInsuranceStartDate: null,
    materialInsuranceEndDate: null,
    badgeIssuanceStartDate: null,
    badgeIssuanceEndDate: null,
    travelPermitStartDate: null,
    travelPermitEndDate: null,
    roadMaintenanceFee: null,
    feePaymentDate: null,
    feeExpireDate: null,
    cellphonePlan: null,
    networkProvider: null,
    networkRegisterDate: null,
    networkExpireDate: null,
    gpsDevice: null,
    gpsDeviceSetupDate: null,
    status: null,
    createdBy: null,
    createdDate: null,
    lastModifiedBy: null,
    lastModifiedDate: null,
  }

  activeTab: number = 1;
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private msg: NzMessageService
  ) {
    this.form = this.fb.group(this.data)
  }


  isShowModalUploadfile = false;
  isConfirmLoading = false;

  loading = false;
  avatarUrl?: string;

  handleChange(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-2);
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    this.fileList = fileList;
  }

  ngOnInit() { }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isShowModalUploadfile = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  handleCancel(): void {
    this.isShowModalUploadfile = false;
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChangeFile(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

}

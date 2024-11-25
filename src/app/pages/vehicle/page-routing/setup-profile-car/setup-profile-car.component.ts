import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { IData } from '../../../../models/setup-profile-car/index.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';
import { VehicalServiceService } from '../../../../shared/services/vehical-service.service';

interface FileCompressed {
  file: File[]
}


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
  @ViewChild('fileInput') fileInput!: ElementRef;
  date = null;
  isEnglish = false;
  fileList: NzUploadFile[] = [];
  fileCompressed: FileCompressed = {
    file: []
  };

  driver_status: number = 0

  form!: FormGroup;

  activeTab: number = 1;
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private vehicalService: VehicalServiceService
  ) {
  }


  isShowModalUploadfile = false;
  isConfirmLoading = false;
  previewImage: string | null | ArrayBuffer = null;
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

  ngOnInit() {
    this.form = this.fb.group(
      {
        isNew: [null, Validators.required],
        registerNo: [null, Validators.required],
        frameNumber: [null, Validators.required],
        machineNumber: [null],
        manufactureYear: [null],
        manufacturer: [null, Validators.required],
        vehicleModel: [null, Validators.required],
        vehicleTypeId: [null, Validators.required],
        capacity: [null, Validators.required],
        image: [null],
        intendedUse: [null],
        routeId: [null, Validators.required],
        odometer: [null, Validators.required],
        // payload: [null, Validators.required],
        firstStartDate: [null, Validators.required],
        subscriptionDate: [null, Validators.required],
        registrationDate: [null, Validators.required],
        registrationExpireDate: [null, Validators.required],
        tndsInsuranceStartDate: [null, Validators.required],
        tndsInsuranceEndDate: [null, Validators.required],
        materialInsuranceStartDate: [null, Validators.required],
        materialInsuranceEndDate: [null, Validators.required],
        badgeIssuanceStartDate: [null, Validators.required],
        badgeIssuanceEndDate: [null, Validators.required],
        travelPermitStartDate: [null, Validators.required],
        travelPermitEndDate: [null, Validators.required],
        roadMaintenanceFee: [null, Validators.required],
        feePaymentDate: [null, Validators.required],
        feeExpireDate: [null, Validators.required],
        cellphonePlan: [null],
        networkProvider: [null],
        networkRegisterDate: [null],
        networkExpireDate: [null],
        gpsDevice: [null],
        gpsDeviceSetupDate: [null],
        driver: this.fb.group({
          id: null,
          driverId: [null],
          driverStatus: ['0'],
          startDate: [null],
          endDate: [null]
        })
      })


      this.form.get('driverStatus')?.value
      this.form.get('driverStatus')?.valueChanges.subscribe((value: any)=> {
        console.log(value)
        this.driver_status = value
      })

      this.getRoute()
  }

  listRoute : any[] = []

  getRoute(){
    this.vehicalService.getRoue().subscribe((response : any)=> {
      this.listRoute = response.data
    })
  }



  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isShowModalUploadfile = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  // handleCancel(): void {
  //   this.isShowModalUploadfile = false;
  // }

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


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileCompressed.file[0] = file
      // Đọc file thành base64
      this.readFileImage(file)
    }
  }

  readFileImage(file: File) {
    const reader = new FileReader();

    reader.onload = (e) => {
      console.log('Reader loaded with result:', reader.result); // Kiểm tra kết quả đọc file
      this.previewImage = e.target?.result!;// Lưu base64 vào biến
      console.log(this.previewImage)
    };
    reader.onerror = (err) => {
      console.error(err)
    }
    reader.readAsDataURL(file);
  }


  handleCancel(): void {
    this.isShowModalUploadfile = false;
    this.previewImage = null; // Reset ảnh khi đóng modal
  }


  ///////////////////////////////////////////createVehical///////////////////////////////////////
  createVehical() {
    const dataForm = {
      ...this.form.value
    }

    const formData = new FormData();

    formData.append('data', JSON.stringify(dataForm));
    // if (this.fileCompressed.file.length > 0) {
    //   formData.append('image', this.fileCompressed.file[0]);
    // }
    formData.append('image', this.fileCompressed.file[0]);
    console.log(this.fileCompressed.file[0])

    formData.forEach(elm => {
      console.log(elm);
      
    })
    // return;
    console.log(dataForm)
    // console.log(formData.append('data', JSON.stringify(dataForm)))

    this.form.markAllAsTouched(); 

    this.vehicalService.createVehical(formData).subscribe((response: any) => {
      console.log(response)
    })
  }

}

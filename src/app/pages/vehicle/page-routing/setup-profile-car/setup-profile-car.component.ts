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
import { NotificationService } from '../../../../shared/services/notification.service';

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
  is_New: any
  form!: FormGroup;

  activeTab: number = 1;
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private vehicalService: VehicalServiceService,
    private notifiService: NotificationService
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
    this.form = this.fb.group({
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
        firstSubcriptionDate: [null, Validators.required],
        fristRegistrationDate: [null, Validators.required],
        firstStartDateXE: [null, Validators.required],
        owningLegalEntity: [null, Validators.required],
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

      this.form.get('isNew')?.valueChanges.subscribe((value: any)=> {
        console.log(value)
        this.is_New = value
      })

      this.getRoute()
  }

  listRoute : any[] = []

  getRoute(){
    this.vehicalService.getRoue().subscribe((response : any)=> {
      this.listRoute = response.data
    })
  }

  listVehical : any[] = []
  getVehicalType(){
    this.vehicalService.getVehicalType().subscribe((response : any)=> {
      this.listVehical = response.data
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
      if(file){
        this.readFileImage(file)
      }else{
        this.notifiService.error('File lỗi')
      }
    }
  }

  readFileImage(file: File) {
    const reader = new FileReader();

    reader.onload = (e) => {
      console.log('Reader loaded with result:', reader.result); // Kiểm tra kết quả đọc file
      this.previewImage = e.target?.result!;// Lưu base64 vào biến
      // console.log(this.previewImage)
    };
    reader.onerror = (err) => {
      console.error(err)
    }
    reader.readAsDataURL(file);
  }


  handleCancel(): void {
    this.isShowModalUploadfile = false;
  }

  ////////////////////////////////////////////////////////////////full image show//////////////////////////////////////////
  isFullImageVisible: boolean = false;
  fullImageSrc: string = '';

openFullImage(imageSrc: any): void {
  this.fullImageSrc = imageSrc;
  this.isFullImageVisible = true;
  console.log(this.fullImageSrc)

}

removeImage(){
  this.previewImage = null
  this.fileCompressed.file = []

}

disableInToFirstSubcriptionDate = (firstSubcriptionDate: Date): boolean => {
  const fristRegistrationDate = this.form.get('fristRegistrationDate')?.value
  return fristRegistrationDate ? firstSubcriptionDate >= fristRegistrationDate : false
}

disableIntoFristRegistrationDate = (fristRegistrationDate: Date): boolean => {
  const firstSubcriptionDate = this.form.get('firstSubcriptionDate')?.value
  return firstSubcriptionDate ? fristRegistrationDate <= firstSubcriptionDate : false
}
///////////////////////đăng kiểm///////////////////////////////////////////////////////////////////
disableInToRegistrationDate = (registrationDate: Date): boolean => {
  const registrationExpireDate = this.form.get('registrationExpireDate')?.value
  return registrationExpireDate ? registrationDate >= registrationExpireDate : false
}

disableIntoRegistrationExpireDate = (registrationExpireDate: Date): boolean => {
  const registrationDate = this.form.get('registrationDate')?.value
  return registrationDate ? registrationExpireDate <= registrationDate : false
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////bảo hiểm TNDS////////////////////////////////////////////////
disableInToTndsInsuranceStartDate  = (tndsInsuranceStartDate: Date): boolean => {
  const tndsInsuranceEndDate = this.form.get('tndsInsuranceEndDate')?.value
  return tndsInsuranceEndDate ? tndsInsuranceStartDate >= tndsInsuranceEndDate : false
}

disableIntoTndsInsuranceEndDate = (tndsInsuranceEndDate: Date): boolean => {
  const tndsInsuranceStartDate = this.form.get('tndsInsuranceStartDate')?.value
  return tndsInsuranceStartDate ? tndsInsuranceEndDate <= tndsInsuranceStartDate : false
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////bảo hiểm vật chất xe//////////////////////////////////////////////////////////
disableInToMaterialInsuranceStartDate  = (materialInsuranceStartDate: Date): boolean => {
  const materialInsuranceEndDate = this.form.get('materialInsuranceEndDate')?.value
  return materialInsuranceEndDate ? materialInsuranceStartDate >= materialInsuranceEndDate : false
}

disableIntoMaterialInsuranceEndDate = (materialInsuranceEndDate: Date): boolean => {
  const materialInsuranceStartDate = this.form.get('materialInsuranceStartDate')?.value
  return materialInsuranceStartDate ? materialInsuranceEndDate <= materialInsuranceStartDate : false
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////phù hiệu/////////////////////////////////////////////////////
disableInToBadgeIssuanceStartDate  = (badgeIssuanceStartDate: Date): boolean => {
  const badgeIssuanceEndDate = this.form.get('badgeIssuanceEndDate')?.value
  return badgeIssuanceEndDate ? badgeIssuanceStartDate >= badgeIssuanceEndDate : false
}

disableIntoBadgeIssuanceEndDate= (badgeIssuanceEndDate: Date): boolean => {
  const badgeIssuanceStartDate = this.form.get('badgeIssuanceStartDate')?.value
  return badgeIssuanceStartDate ? badgeIssuanceEndDate <= badgeIssuanceStartDate : false
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////giấy đi đường/////////////////////////////////////////////////////
disableInToTravelPermitStartDate  = (travelPermitStartDate: Date): boolean => {
  const travelPermitEndDate = this.form.get('travelPermitEndDate')?.value
  return travelPermitEndDate ? travelPermitStartDate >= travelPermitEndDate : false
}

disableIntoTravelPermitEndDate= (travelPermitEndDate: Date): boolean => {
  const travelPermitStartDate = this.form.get('travelPermitStartDate')?.value
  return travelPermitStartDate ? travelPermitEndDate <= travelPermitStartDate : false
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////Ngày đóng, ngày hết hạn bắt buộc/////////////////////////////////////////////////////

disableInToFeePaymentDate = (feePaymentDate: Date): boolean => {
  const feeExpireDate = this.form.get('feeExpireDate')?.value
  return feeExpireDate ? feePaymentDate >= feeExpireDate : false
}

disableIntoFeeExpireDate= (feeExpireDate: Date): boolean => {
  const feePaymentDate = this.form.get('feePaymentDate')?.value
  return feePaymentDate ? feeExpireDate <= feePaymentDate : false
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////Ngày đóng, ngày hết hạn không bắt buộc/////////////////////////////////////////////////////

disableInToNetworkRegisterDate = (networkRegisterDate: Date): boolean => {
  const networkExpireDate = this.form.get('networkExpireDate')?.value
  return networkExpireDate ? networkRegisterDate >= networkExpireDate : false
}

disableIntoNetworkExpireDate= (networkExpireDate: Date): boolean => {
  const networkRegisterDate = this.form.get('networkRegisterDate')?.value
  return networkRegisterDate ? networkExpireDate <= networkRegisterDate : false
}

disableAfterDate(name: string): (afterDate: Date | null) => boolean {
  return (afterDate: Date | null): boolean => {
    if (!afterDate || !this.form) return false;

    const beforeDate = this.form.get(name)?.value;
    if (!beforeDate) return false;

    const beforeDateObject = new Date(beforeDate);

    return afterDate >= beforeDateObject;
  };
}

disableBeforeDate(name: string): (beforeDate: Date | null) => boolean {
  return (beforeDate: Date | null): boolean => {
    if (!beforeDate || !this.form) return false;

    const afterDate = this.form.get(name)?.value;
    if (!afterDate) return false;

    const AfterDateObject = new Date(afterDate);

    return beforeDate <= AfterDateObject;
  };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////createVehical///////////////////////////////////////
  createVehical() {
    const dataForm = {
      ...this.form.value
    }

    const formData = new FormData();

    formData.append('data', JSON.stringify(dataForm));
    formData.append('image', this.fileCompressed.file[0]);
    console.log(this.fileCompressed.file[0])

    formData.forEach(elm => {
      console.log(elm);
      
    })
    // return;
    console.log(dataForm)
    // console.log(formData.append('data', JSON.stringify(dataForm)))

    this.form.markAllAsTouched(); 

    if(this.form.valid){
      this.vehicalService.createVehical(formData).subscribe((response: any) => {
        console.log(response)
      })
    }
  }

}

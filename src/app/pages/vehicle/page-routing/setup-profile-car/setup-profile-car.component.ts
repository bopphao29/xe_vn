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
import Swal from 'sweetalert2';

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
  isSubmitted = false;
  isEnglish = false;
  fileList: NzUploadFile[] = [];
  fileCompressed: FileCompressed = {
    file: []
  };

  status_vehical: number = 0
  is_New: any
  form!: FormGroup;
  labelTruck : boolean = false
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
    const yearNow = new Date().getFullYear()
    this.form = this.fb.group({
        isNew: [null, Validators.required],
        registerNo: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9\-.]+$/)]],
        frameNumber: [null, Validators.maxLength(17)],
        machineNumber: [null, Validators.maxLength(17)],
        manufactureYear: [null, [Validators.min(1950), Validators.max(yearNow), Validators.maxLength(4)]],
        manufacturer: [null, Validators.required],
        vehicleModel: [null, Validators.required],
        vehicleTypeId: [null],
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

      this.form.valueChanges.subscribe((value: any) => {
        Object.keys(this.form.controls).forEach(controlName => {
          const control = this.form.get(controlName);
          if (control && control.errors) {
            console.log(`Lỗi ở trường: ${controlName}`, control.errors);
          }
        });
      });
      

      this.form.get('driver.driverStatus')?.valueChanges.subscribe((value: any)=> {
        // this.status_vehical = value
        // console.log(value);
        
      

        if(value === '0' || value === 0){
          this.status_vehical = 0
        }else{
          this.status_vehical = 1
        }
      })

      this.form.get('vehicleTypeId')?.valueChanges.subscribe((value : any)=> {
        console.log(value);
        const isTruck = this.listVehical.find((item: any)=> item.id === parseInt(value))
        if(isTruck){
        const codeTruck : any = isTruck.code

        if(isTruck && codeTruck == 'XE_TAI'){
          this.labelTruck = true
        }
        }
      })
      this.form.get('isNew')?.valueChanges.subscribe((value: any)=> {
        console.log(value)
        this.is_New = value
      })

      this.getRoute()
      this.getVehicalType()
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



  /////////////////////////////////////keo tha anh:
  isDragOver: boolean = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true; // Thay đổi trạng thái để highlight
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false; // Bỏ highlight khi rời khỏi vùng thả
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.fileCompressed.file[0] = file
      this.handleFile(file);
    }
  }

  handleFile(file: File): void {
    // Kiểm tra loại file
    if (file.type.startsWith('image/')) {
      this.readFileImage(file);
    } else {
      Swal.fire({
        icon: 'error',
        title:'Vui lòng tải lên một file hình ảnh hợp lệ!'
      })
    }
  }

  ///////////////////////////////////////////////
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
    console.log(this.fileCompressed.file[0])
    const dataForm = {
      ...this.form.value,
      image: this.fileCompressed.file ? this.fileCompressed.file[0].name : null,
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
    if(this.form.get('isNew')?.value == 1 || this.form.get('isNew')?.value == '1'){
      this.form.get('firstStartDateXE')?.clearAsyncValidators()
      this.form.get('firstSubcriptionDate')?.clearAsyncValidators()
      this.form.get('fristRegistrationDate')?.clearAsyncValidators()
    }else{
      this.form.get('firstStartDateXE')?.setValidators(Validators.required)
      this.form.get('firstSubcriptionDate')?.setValidators(Validators.required)
      this.form.get('fristRegistrationDate')?.setValidators(Validators.required)
    }

    this.form.get('firstStartDateXE')?.updateValueAndValidity()
      this.form.get('firstSubcriptionDate')?.updateValueAndValidity()
      this.form.get('fristRegistrationDate')?.updateValueAndValidity()

    if (this.form.valid) {
      this.isSubmitted = true;
      this.vehicalService.createVehical(formData).subscribe((response: any) => {
        console.log(response)
      })
    } else {
      console.log('lỗi')
      Object.keys(this.form.controls).forEach((field: any) => {
        const control = this.form.get(field)

        if (control && control.invalid) {
          console.log("lỗi ở: " + field)

          const errors = control.errors;
          if (errors) {
            Object.keys(errors).forEach((errkey: any) => {
              switch (errkey) {
                case 'required':
                  console.log(field + "phai dien")
                  break;
                case 'minlength':
                  console.log(field + "bi be hon gi day")
                  break;
                case 'pattern':
                  console.log(field + 'dinh dang sai')
                  break;
                case 'email':
                  console.log(field + 'mail sai')
                  break;
                default:
                  console.log('loi khac o : ' + field, errors[errkey])
                  break;
              }
            })
          }
        }
      })
    }


    
  }

}

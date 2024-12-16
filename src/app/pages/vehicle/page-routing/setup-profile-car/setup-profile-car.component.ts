import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, formatNumber } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UploadImageService } from '../../../../shared/services/upload-image.service';
import { VIETNAMESE_REGEX } from '../../../../shared/constants/common.const';

import { IData } from '../../../../models/setup-profile-car/index.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';
import { VehicalServiceService } from '../../../../shared/services/vehical-service.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ValidateIntoPageService } from '../../../../shared/services/validate-into-page.service';

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
    NzModalModule,
    NzToolTipModule,
    MatTooltipModule
  ]
})
export class SetupProfileCarComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  date = null;
  isSubmitted = false; // Đánh dấu trạng thái xác nhận
  submitDisabled = true; // Ban đầu nút "Xác nhận" bị vô hiệu hóa
  resetDisabled = true; // Ban đầu nút "Reset" bị vô hiệu hóa
  isEnglish = false;
  fileList: NzUploadFile[] = [];
  fileCompressed: FileCompressed = {
    file: []
  };

  status_vehicle: number = 0
  is_New: any
  form!: FormGroup;
  labelTruck : boolean = false
  activeTab: number = 1;
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private vehicalService: VehicalServiceService,
    private notifiService: NotificationService,
    private uploadImageService: UploadImageService,
    private routes: Router,
    private validateService: ValidateIntoPageService,
    
  ) {
  }


  isShowModalUploadfile = false;
  isConfirmLoading = false;
  previewImage: string | null | ArrayBuffer = null;
  loading = false;
  avatarUrl?: string;
  isDone : boolean = false


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

  maxYear: number = 0
  minYear: number = 0
  ngOnInit() {
    var year = new Date()
    const maxYear = new Date().getFullYear()
    const minYear = (year.getFullYear() - 60)
    this.maxYear = maxYear
    this.minYear = minYear
    this.form = this.fb.group({
        isNew: [null, Validators.required],
        registerNo: [null, [Validators.required]],
        frameNumber: [null, [Validators.maxLength(17), Validators.pattern(/^[0-9]*$/)]],
        machineNumber: [null, [Validators.maxLength(17), Validators.pattern(/^[0-9]*$/)]],
        manufactureYear: [null, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.max(maxYear),Validators.maxLength(4)]],
        manufacturer: [null, [Validators.required, Validators.pattern(VIETNAMESE_REGEX)]],
        vehicleModelId: [null, Validators.required],
        vehicleTypeId: [null, [Validators.required]],
        capacity: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        image: [null],
        intendedUse: [null],
        routeId: [null, Validators.required],
        odometer: [null,[ Validators.required, Validators.maxLength(16), Validators.pattern(/^[0-9]*$/)]],
        // payload: [null, Validators.required],
        firstSubscriptionDate: [null, Validators.required],
        fristRegistrationDate: [null, Validators.required],
        firstStartDateXE: [null, Validators.required],
        legalOwnerId: [null, Validators.required],
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
        networkProvider: [null, [Validators.pattern(VIETNAMESE_REGEX)]],
        networkRegisterDate: [null],
        networkExpireDate: [null],
        gpsDevice: [null],
        gpsDeviceSetupDate: [null],
        driver: this.fb.group({
          driverId: null,
          driverName: [null],
          driverStatus: ['0'],
          phoneNumber: null,
          startDate: [null],
          endDate: [null]
        })
      })

      // this.form.valueChanges.subscribe((value: any) => {
      //   this.submitDisabled = !this.form.valid;
      //   Object.keys(this.form.controls).forEach(controlName => {
      //     const control = this.form.get(controlName);
      //     if (control && control.errors) {
      //       console.log(`Lỗi ở trường: ${controlName}`, control.errors);
      //     }
      //   });
      // });
      

      this.form.get('driver.driverStatus')?.valueChanges.subscribe((value: any)=> {
        if(value === '0' || value === 0){
          this.status_vehicle = 0
        }else{
          this.status_vehicle = 1
        }
      })

      this.form.get('vehicleTypeId')?.valueChanges.subscribe((value : any)=> {
        console.log(value);
        const isTruck = this.listVehicle.find((item: any)=> item.id === parseInt(value))
        if(isTruck){
          const codeTruck : any = isTruck.code

          if(isTruck && codeTruck == 'XE_TAI'){
            this.labelTruck = true
          }
        }

      if(value){
        this.getVehicleModel(value)
      }


      })
      this.form.get('isNew')?.valueChanges.subscribe((value: any)=> {
        this.is_New = value
        if(this.is_New !== "0"){
          this.form.get('firstStartDateXE')?.reset()
          this.form.get('firstSubscriptionDate')?.reset()
          this.form.get('fristRegistrationDate')?.reset()
          this.form.get('firstStartDateXE')?.clearValidators()
          this.form.get('firstSubscriptionDate')?.clearValidators()
          this.form.get('fristRegistrationDate')?.clearValidators()
        }
          else{
          this.form.get('firstStartDateXE')?.setValidators(Validators.required)
          this.form.get('firstSubscriptionDate')?.setValidators(Validators.required)
          this.form.get('fristRegistrationDate')?.setValidators(Validators.required)
        }
    
        this.form.get('firstStartDateXE')?.updateValueAndValidity()
        this.form.get('firstSubscriptionDate')?.updateValueAndValidity()
        this.form.get('fristRegistrationDate')?.updateValueAndValidity()
    
      })

      this.form.get('driver.driverName')?.valueChanges.subscribe((value: any) => {
        const selectedDriver = this.listDriver.find((driver: any) => driver.id === value); // Sửa thành so sánh đúng
        if (selectedDriver) {
          // Nếu tìm thấy lái xe, cập nhật số điện thoại
          this.form.get('driver')?.patchValue({
            phoneNumber: selectedDriver.phoneNumber, // Sử dụng đúng trường dữ liệu
            driverId: selectedDriver.id
          });
        } else {
          // Nếu không tìm thấy hoặc giá trị trống, đặt lại phoneNumber
          this.form.get('driver')?.patchValue({
            phoneNumber: '',
          });
        }
      });
      

      this.getRoute()
      this.getVehicleType()
      this.getLegalOwners()
      this.searchDriver()
  }

  listRoute : any[] = []

  getRoute(){
    this.vehicalService.getRoue().subscribe((response : any)=> {
      this.listRoute = response.data
    })
  }

  listVehicle : any[] = []
  getVehicleType(){
    this.vehicalService.getVehicleType().subscribe((response : any)=> {
      this.listVehicle = response.data
      console.log(response)
    })
  }

  listVehicleModel : any[]= []
  getVehicleModel(id : any){
    this.vehicalService.getVehicleModel(id).subscribe((response: any)=> {
      this.listVehicleModel = response.data
      console.log(response)
    })
  }

  listLegalOwner : any[]= []
  getLegalOwners(){
    this.vehicalService.getLegalOwners().subscribe((response: any)=> {
      this.listLegalOwner = response.data
      console.log(response.data)
    })
  }

  listDriver: any[] = []
  searchDriver(){
    const dataSearch = {
      ids: [],
      name: "",
      phoneNumber: ""
    }

    this.vehicalService.searchDriver(dataSearch).subscribe((response: any)=> {
      this.listDriver = response.data
    })
  }
  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isShowModalUploadfile = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  handleCancelDone1(){
    this.isDone = false
  }

  handleSubmitDone(){
    this.routes.navigate(['vehicle/profile-vehicle-management'])
    localStorage.setItem('activeLink','vehicleProfileManagement')
  }

  ///////reset form/////
  resetForm(){
    this.form.reset({
      driver: {
        driverStatus: 0 || '0',
      }
    })
    this.isSubmitted = false;
    this.submitDisabled = true; 
    this.resetDisabled = true; 
  }

  
  endClick(){
    this.isDone = false
    this.form.reset({
      driverStatus: this.form.get('driverStatus')?.value || '0',
    })
  }

  //////////////////////////////////////validate just enter text input/////////////////
  validateText(path: string | (string | number)[], event: Event) {
    this.validateService.validateText(this.form, path, event)
  }
  
  validateEnterTextNumber( path: string | (string | number)[], event: Event) {
    this.validateService.validateEnterTextNumber(this.form, path, event)
  }

//////////////////////////////////////validate just enter number input/////////////////
validateNumber(name:string , event : Event){
  this.validateService.validateNumber(this.form, name, event)
}

validatorsRequired(name: string | (string | number)[]){
  this.validateService.validatorsRequired(this.form, name)
}

//////////////////////////////định dạng tiền////////////////////////////////////////
updateFormattedPrice() {
  const control = this.form.get('roadMaintenanceFee');
    if (control) {
      const rawValue = control.value.replace(/[^\d]/g, ''); // Loại bỏ ký tự không phải số
      const formattedValue = this.addThousandSeparator(rawValue); // Thêm dấu phân cách hàng nghìn
      control.setValue(formattedValue, { emitEvent: false }); // Cập nhật giá trị
    }
}

// Loại bỏ định dạng khi nhập
addThousandSeparator(value: any) {
  if(value){
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
/////dữ liệu roadMaintenanceFee không có dấu ,
getRawValue() {
  const rawValue = this.form.get('roadMaintenanceFee')?.value;
  return rawValue ? rawValue.replace(/,/g, '') : ''; // Loại bỏ dấu phẩy
}


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

      const nzFile: NzUploadFile = {
        uid: `${Date.now()}`, // Tạo UID duy nhất
        name: file.name,
        size: file.size,
        type: file.type,
        originFileObj: file, // Gắn file gốc
      };
      
      const isValid = this.uploadImageService.beforeUpload(nzFile);
      // Đọc file thành base64
      if(isValid){
        if(file){
          this.readFileImage(file)
        }else{
          this.notifiService.error('File lỗi')
        }
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
    // reader.onerror = (err) => {
    //   console.error(err)
    // }
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
  createVehicle() {
    console.log(this.fileCompressed.file[0])
    const dataForm = {
      ...this.form.value,
      image: (this.fileCompressed.file && this.form.get('image')?.value) ? this.fileCompressed.file[0].name : null,
      roadMaintenanceFee: this.getRawValue(),
    }

    const formData = new FormData();

    formData.append('data', JSON.stringify(dataForm));
    if(this.fileCompressed.file && this.form.get('image')?.value){
      formData.append('image', this.fileCompressed.file[0]);
    }
    console.log(this.fileCompressed.file[0])

    formData.forEach(elm => {
      console.log(elm);
      
    })
    // return;
    console.log(dataForm)
    // console.log(formData.append('data', JSON.stringify(dataForm)))

    this.form.markAllAsTouched(); 
    // console.log(this.form.get('isNew')?.value)

    if (this.form.valid) {
      
      this.vehicalService.createVehicle(formData).subscribe( {
        next : (response: any) => {
          this.isSubmitted = true; // Đánh dấu trạng thái đã xác nhận
          this.submitDisabled = true; // Vô hiệu hóa nút "Xác nhận"
          this.resetDisabled = false; // Bật nút "Reset"
          this.notifiService.success('Tạo mới thành công')
          this.isDone = true
        },
        error: (error: any)=>{
          this.notifiService.error('Có lỗi xảy ra')
        }
      })
    } else {
      // console.log('lỗi')
      // Object.keys(this.form.controls).forEach((field: any) => {
      //   const control = this.form.get(field)

      //   if (control && control.invalid) {
      //     console.log("lỗi ở: " + field)

      //     const errors = control.errors;
      //     if (errors) {
      //       Object.keys(errors).forEach((errkey: any) => {
      //         switch (errkey) {
      //           case 'required':
      //             console.log(field + "phai dien")
      //             break;
      //           case 'minlength':
      //             console.log(field + "bi be hon gi day")
      //             break;
      //           case 'pattern':
      //             console.log(field + 'dinh dang sai')
      //             break;
      //           case 'email':
      //             console.log(field + 'mail sai')
      //             break;
      //           default:
      //             console.log('loi khac o : ' + field, errors[errkey])
      //             break;
      //         }
      //       })
      //     }
      //   }
      // })
    }


    
  }

}

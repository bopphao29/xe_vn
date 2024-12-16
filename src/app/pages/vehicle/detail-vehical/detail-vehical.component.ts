import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { VehicalServiceService } from '../../../shared/services/vehical-service.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotificationService } from '../../../shared/services/notification.service';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ActivatedRoute, Router } from '@angular/router';



interface FileCompressed {
  file: File[]
}

@Component({
  selector: 'app-detail-vehical',
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
    NzPaginationModule
  ],
  templateUrl: './detail-vehical.component.html',
  styleUrl: './detail-vehical.component.scss'
})
export class DetailVehicalComponent implements OnInit{
  @ViewChild('fileInput') fileInput!: ElementRef;
  fileCompressed: FileCompressed = {
    file: []
  };
  form!: FormGroup
  constructor(
    private vehicalService : VehicalServiceService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private notifiService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    
  ){

  }

  maxYear: number = 0
  minYear: number = 0
  status_vehicle: number = 0

  ngOnInit() {
    var year = new Date()
    const maxYear = new Date().getFullYear()
    const minYear = (year.getFullYear() - 200)
    this.maxYear = maxYear
    this.minYear = minYear
    this.form = this.fb.group({
        isNew: [null, Validators.required],
        registerNo: [null, [Validators.required]],
        frameNumber: [null, [Validators.maxLength(17)]],
        machineNumber: [null, [Validators.maxLength(17)]],
        manufactureYear: [null, [Validators.required, Validators.min(minYear), Validators.max(maxYear), Validators.maxLength(4)]],
        manufacturer: [null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ỹà-ỹ\\s]+$')]],
        vehicleModelId: [null, Validators.required],
        vehicleTypeId: [null, [Validators.required]],
        capacity: [null, Validators.required],
        image: [null],
        intendedUse: [null],
        routeId: [null, Validators.required],
        odometer: [null,[ Validators.required, Validators.maxLength(16)]],
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
        loanOrganization: [null],
        loanDate: [null],
        loanMoney: [null],
        cellphonePlan: [null],
        networkProvider: [null],
        networkRegisterDate: [null],
        networkExpireDate: [null],
        gpsDevice: [null],
        gpsDeviceSetupDate: [null],
        driver: this.fb.group({
          driverId: null,
          driverName: [null],
          driverStatus: [null],
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
      

      this.form.disable()
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

      this.route.params.subscribe((params: any)=> {
        const id = params['id']
        this.getVhicalDetail(id)
      })
  }

  status_vehical: number = -1
  labelTruck : boolean = false

  isFixEmployeeButton: boolean = false
  previewImage: string | null | ArrayBuffer = null;
  isShowModalUploadfile = false;

  //////////////get list
  listVehical : any[] = []
  listRoute: any[] = []
  is_New: any
  getRoute(){
    this.vehicalService.getRoute().subscribe((response : any)=> {
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


  listVehicleModel : any[]= []

getVhicalDetail(id : any){
    this.vehicalService.getVehicleDetail(id).subscribe((response : any) => {
      const data = response.data
      this.form.patchValue(data)

      if(data.vehicleModelId != null){
        this.form.get('vehicleModelId')?.setValue(data.vehicleModelId)
      }
      if(data.routeId != null){
        this.form.get('routeId')?.setValue(data.routeId)
      }
      if(data.legalOwnerId != null){
        this.form.get('legalOwnerId')?.setValue(data.legalOwnerId)
      }

      const driverGroup = this.form.get('driver');
      console.log(driverGroup)

      if (driverGroup && driverGroup.value) {
      const driverStatus = data.driver.driverStatus?.toString();

        this.form.get('driver')?.get('driverStatus')?.setValue(driverStatus)
        console.log(data.driver.driverStatus)
      }
      
    })

    
  }


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
  
//////////////////////////////////////////////////////Disable date////////////////////////////////////////////////////////

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

validateText(event : Event){
  const valueInput = event.target as HTMLInputElement;
  const pattern = /^[a-zA-ZÀ-ỹà-ỹ\s]*$/;
  if(!pattern.test(valueInput.value)){
    valueInput.value = valueInput.value.replace(/[^a-zA-ZÀ-ỹà-ỹ\s]/g, '') ///  nếu kí tự không hợp lệ thì loại bỏ
  }
}

//////////////////////////////////////validate just enter number input/////////////////
validateNumber(event : Event){
  const valueNum = event.target as HTMLInputElement;
  valueNum.value = valueNum.value.replace(/[^0-9]/g, '')
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

  // Đảm bảo rawValue là chuỗi
  return rawValue ? String(rawValue).replace(/,/g, '') : ''; // Loại bỏ dấu phẩy
}





  ///////////////////////////////
  onBack(event : any){
    const router = localStorage.getItem('activeLink')
    if(router === 'vehicleProfileManagement'){
      event.preventDefault();
      this.router.navigate(['vehicle/profile-vehicle-management']);
    }

  }

  cancelFix(){
    this.form.disable()
    this.isFixEmployeeButton = false
  }

  onFix(){
    this.form.enable()
    this.isFixEmployeeButton = true
  }

  saveDataEmployee(){

    const imageFileName = this.fileCompressed?.file?.length > 0 ? this.fileCompressed.file[0].name : null;
    console.log(this.fileCompressed.file)
    const dataForm = {
      ...this.form.value,
      id: 3,
      image: this.form.get('image')?.value || imageFileName,
      roadMaintenanceFee: this.getRawValue(),
    }

    const formData = new FormData();

    formData.append('data', JSON.stringify(dataForm));
    if(this.fileCompressed?.file?.length > 0 && this.form.get('image')?.value){
      formData.append('image', this.fileCompressed.file[0]);
    }
    console.log(this.fileCompressed.file[0])

    formData.forEach(elm => {
      console.log(elm);
      
    })
    // return;
    console.log(dataForm)
    // console.log(formData.append('data', JSON.stringify(dataForm)))

    // this.form.markAllAsTouched(); 
    // console.log(this.form.get('isNew')?.value)

    // this.vehicalService.updateVehicle(formData).subscribe((response: any)=> {
    //   this.notifiService.success('Sửa thông tin phương tiện thành công')
      
    // })

    if (this.form.valid) {
      
      this.vehicalService.updateVehicle(formData).subscribe( {
        next : (response: any) => {
          this.notifiService.success('Sửa thông tin phương tiện thành công')
          this.form.disable()
          this.isFixEmployeeButton =false
        },
        error: (error: any)=>{
          this.notifiService.error('Có lỗi xảy ra')
        }
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

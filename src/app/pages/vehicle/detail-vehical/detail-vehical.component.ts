import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    private notifiService: NotificationService
  ){

  }

  ngOnInit(): void {
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
      loanOrganization:[null],
      loanDate: [null],
      loanMoney: [null],
      driver: this.fb.group({
        id: null,
        driverId: [null],
        driverStatus: ['0'],
        startDate: [null],
        endDate: [null]
      })
    })

    this.form.get('driverStatus')?.valueChanges.subscribe((value: any) => {
      console.log(value)
      if(value === '0' || value === 0){
        this.status_vehical = 0
      }else{
        this.status_vehical = 1
      }
      
    })
  }

  status_vehical: number = -1

  isFixEmployeeButton: boolean = false
  previewImage: string | null | ArrayBuffer = null;
  isShowModalUploadfile = false;

  //////////////get list
  listVehical : any[] = []
  listRoute: any[] = []
  is_New: any
  getVehicalType(){
    this.vehicalService.getVehicalType().subscribe((response : any)=> {
      this.listVehical = response.data
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



  ///////////////////////////////
  onBack(event : any){

  }

  cancelFix(){

  }
  saveDataEmployee(){

  }







}

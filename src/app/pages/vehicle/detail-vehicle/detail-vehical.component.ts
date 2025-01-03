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
import { ValidateIntoPageService } from '../../../shared/services/validate-into-page.service';
import Swal from 'sweetalert2';
import { PDF } from '../../../shared/pdf/pdf.util';
import { forkJoin } from 'rxjs';

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
export class DetailVehicalComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  fileCompressed: FileCompressed = {
    file: []
  };
  form!: FormGroup
  constructor(
    private vehicle: VehicalServiceService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private notifiService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private validateService: ValidateIntoPageService,
    private notification: NotificationService
  ) {

  }

  maxYear: number = 0
  minYear: number = 0
  status_vehicle: number = 0
  isApprove: boolean = false


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
      status: [null],
      intendedUse: [null],
      routeId: [null, Validators.required],
      odometer: [null, [Validators.required, Validators.maxLength(16)]],
      // payload: [null, Validators.required],
      firstSubscriptionDate: [null, Validators.required],
      firstRegistrationDate: [null, Validators.required],
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
      loanAmount: [null],
      cellphonePlan: [null],
      networkProvider: [null],
      networkRegisterDate: [null],
      networkExpireDate: [null],
      gpsDevice: [null],
      gpsDeviceSetupDate: [null],
      driver: this.fb.group({
        driverId: null,
        driverName: [null, Validators.required],
        driverStatus: [null],
        phoneNumber: [{ value: null, disabled: true }],
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
    this.form.get('driver.driverStatus')?.valueChanges.subscribe((value: any) => {
      if (value == 1) {
        this.status_vehicle = 1
      } else {
        this.status_vehicle = 2
      }
    })

    this.form.get('vehicleTypeId')?.valueChanges.subscribe((value: any) => {
      console.log(value);
      const isTruck = this.listVehicle.find((item: any) => item.id === parseInt(value))
      if (isTruck) {
        const codeTruck: any = isTruck.code

        if (isTruck && codeTruck == 'XE_TAI') {
          this.labelTruck = true
        }
      }

      if (value) {
        this.getVehicleModel(value)
      }


    })
    this.form.get('isNew')?.valueChanges.subscribe((value: any) => {
      this.is_New = value
      if (this.is_New !== "0") {
        this.form.get('firstStartDateXE')?.reset()
        this.form.get('firstSubscriptionDate')?.reset()
        this.form.get('firstRegistrationDate')?.reset()
        this.form.get('firstStartDateXE')?.clearValidators()
        this.form.get('firstSubscriptionDate')?.clearValidators()
        this.form.get('firstRegistrationDate')?.clearValidators()
      }
      else {
        this.form.get('firstStartDateXE')?.setValidators(Validators.required)
        this.form.get('firstSubscriptionDate')?.setValidators(Validators.required)
        this.form.get('firstRegistrationDate')?.setValidators(Validators.required)
      }

      this.form.get('firstStartDateXE')?.updateValueAndValidity()
      this.form.get('firstSubscriptionDate')?.updateValueAndValidity()
      this.form.get('firstRegistrationDate')?.updateValueAndValidity()

    })

    this.form.get('driver.driverName')?.valueChanges.subscribe((value: any) => {
      // Tìm lái xe theo id
      const selectedDriver = this.listDriver.find((driver: any) => driver.id === value); // So sánh theo id
      if (selectedDriver) {
        // Nếu tìm thấy, cập nhật các trường
        this.form.get('driver')?.patchValue({
          phoneNumber: selectedDriver.phoneNumber, // Cập nhật số điện thoại
          driverId: selectedDriver.id // Cập nhật driverId
        });
      } else {
        // Nếu không tìm thấy, đặt lại các giá trị
        this.form.get('driver')?.patchValue({
          phoneNumber: '',
          driverId: null
        });
      }

      this.form.get('routeId')?.valueChanges.subscribe((value: any) => {
        if (value) {
          this.searchDriver(value)
        } else {
          console.log('')
        }
      })
    });


    forkJoin([
      this.vehicle.getRoute(),
      this.vehicle.getVehicleType(),
      this.vehicle.getLegalOwners()
    ]).subscribe(([res1, res2, res3]: any) => {
      this.listRoute = res1.data;
      this.listVehicleModel = res2.data;
      this.listLegalOwner = res3.data;
      this.route.params.subscribe((params: any) => {
        this.idDetail = params['id']

        this.getVhicalDetail(this.idDetail)
      })
    })
    // this.searchDriver()

  }

  idDetail: any
  status_vehical: number = -1
  labelTruck: boolean = false

  isFixEmployeeButton: boolean = false
  previewImage: string | null | ArrayBuffer = null;
  isShowModalUploadfile = false;

  //////////////get list
  listVehical: any[] = []
  listRoute: any[] = []
  is_New: any

  getRoute() {
    return this.vehicle.getRoute()

  }

  listVehicle: any[] = []
  getVehicleType() {
    return this.vehicle.getVehicleType()
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileCompressed.file[0] = file
      // Đọc file thành base64
      if (file) {
        this.readFileImage(file)
      } else {
        this.notifiService.error('File lỗi')
      }
    }
  }

  handleCancel(): void {
    this.isShowModalUploadfile = false;
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
        title: 'Vui lòng tải lên một file hình ảnh hợp lệ!'
      })
    }
  }

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

  isFullImageVisible: boolean = false;
  fullImageSrc: string = '';
  openFullImage(imageSrc: any): void {
    this.fullImageSrc = imageSrc;
    this.isFullImageVisible = true;
    console.log(this.fullImageSrc)

  }

  removeImage() {
    this.previewImage = null
    this.fileCompressed.file = []

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

  listVehicleModel: any[] = []

  approvalStatus: any

  inforVehicle: any
  getVhicalDetail(id: any) {
    this.vehicle.getVehicleDetail(id).subscribe((response: any) => {
      this.inforVehicle = response.data
      const data = response.data
      this.approvalStatus = response.data.approvalStatus
      this.form.patchValue(data)
      if (data.vehicleModelId != null) {
        this.form.get('vehicleModelId')?.setValue(data.vehicleModelId)
      }
      if (data.routeId != null) {
        this.form.get('routeId')?.setValue(data.routeId)
      }
      if (data.legalOwnerId != null) {
        this.form.get('legalOwnerId')?.setValue(data.legalOwnerId)
      }

      console.log(data.status)
      if (data.status != null) {
        this.form.get('status')?.setValue(data.status.toString())
      }
      if (data.isNew != null) {
        this.form.get('isNew')?.setValue(data.isNew.toString())
      }

      const driverGroup = this.form.get('driver');
      setTimeout(() => {
        if (driverGroup) {
          if (data.driver) {
            console.log(data.driver)
            console.log(this.listDriver)

            const driverId = this.listDriver.find(driver => driver.id == data.driver.driverId)
            console.log(driverId)
            this.form.get('driver')?.patchValue({
              driverName: driverId.id || data.driver.driverName, // Patch ID, để `nz-select` hiển thị tên
              phoneNumber: data.driver.phoneNumber || '',
              driverStatus: data.driver.driverStatus?.toString() || '1',
              startDate: data.driver.startDate || null,
              endDate: data.driver.endDate || null,
            });
          } else {
            this.form.get('driver')?.patchValue({
              driverName: null, // Không có driver, để trống
              phoneNumber: '',
              driverStatus: '1',
              startDate: null,
              endDate: null,
            });
          }
        }
      }, 500)
    });
  }


  getVehicleModel(id: any) {
    this.vehicle.getVehicleModel(id).subscribe((response: any) => {
      this.listVehicleModel = response.data
    })
  }

  listLegalOwner: any[] = []
  getLegalOwners() {
    return this.vehicle.getLegalOwners()
  }

  listDriver: any[] = []

  searchDriver(value: number) {
    const dataSearch = {
      routeId: value,
      ids: [],
      name: "",
      phoneNumber: "",
    };

    this.vehicle.searchDriver(dataSearch).subscribe(
      (response: any) => {
        this.listDriver = response.data;
      },
      (error) => { }
    );
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

  validateText(path: string | (string | number)[], event: Event) {
    this.validateService.validateText(this.form, path, event)
  }

  validateEnterTextNumber(path: string | (string | number)[], event: Event) {
    this.validateService.validateEnterTextNumber(this.form, path, event)
  }

  //////////////////////////////////////validate just enter number input/////////////////
  validateNumber(name: string, event: Event) {
    this.validateService.validateNumber(this.form, name, event)
  }

  validateYear(name: string | (string | number)[], event: Event) {
    this.validateService.validateYearOfBirth(this.form, name, event, this.minYear, this.maxYear)
  }

  validatorsRequired(name: string | (string | number)[]) {
    this.validateService.validatorsRequired(this.form, name)
  }

  validatorNumberAndEnglishText(name: string | (string | number)[], event: Event) {
    this.validateService.validatorNumberAndEnglishText(this.form, name, event)
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
    if (value) {
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
  onBack(event: any) {
    const router = localStorage.getItem('activeLink')
    if (router === 'vehicleProfileManagement') {
      event.preventDefault();
      this.router.navigate(['vehicle/profile-vehicle-management']);
    }

  }

  cancelFix() {
    this.form.disable()
    this.isFixEmployeeButton = false
  }

  onFix() {
    this.form.enable()
    this.isFixEmployeeButton = true
  }

  handleCancelApprove() {
    this.isApprove = false
  }

  handleSubmitApprove() {
    const data = {
      vehicleId: Number(this.idDetail),
      approvalStatus: 2,
      reason: ''
    }
    this.vehicle.approveVehical(data).subscribe({
      next: (response) => {
        this.notification.success('Duyệt thành công!')
        this.isApprove = false
        this.router.navigate(['vehicle/profile-vehicle-management'])
      }
    })
  }

  id: any
  selectedDriverName: string | null = null;
  saveDataEmployee() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    const driverId = Number(this.form.get('driver')?.get('driverName')?.value);

    if (driverId) {
      const driver = this.listDriver.find(item => item.id == driverId); // Tìm driver theo id
      this.selectedDriverName = driver ? driver.name : null; // Gán tên driver nếu tìm thấy
    } else {
      this.selectedDriverName = null;
    }

    console.log(this.selectedDriverName)
    const imageFileName = this.fileCompressed?.file?.length > 0 ? this.fileCompressed.file[0].name : null;
    console.log(this.form.get('driver')?.get('driverName')?.value)
    console.log(this.fileCompressed.file)
    const dataForm = {
      id: this.id,
      ...this.form.value,
      driver: {
        ...this.form.get('driver')?.value,
        driverId: driverId,
        driverName: this.selectedDriverName
      },
      image: this.form.get('image')?.value || imageFileName,
      roadMaintenanceFee: this.getRawValue(),
    }

    const formData = new FormData();

    formData.append('data', JSON.stringify(dataForm));
    if (this.fileCompressed?.file?.length > 0 && this.form.get('image')?.value) {
      formData.append('image', this.fileCompressed.file[0]);
    }
    console.log(this.fileCompressed.file[0])

    formData.forEach(elm => {
      console.log(elm);

    })
    // return;
    console.log(dataForm)

    if (this.form.valid) {

      this.vehicle.updateVehicle(formData).subscribe({
        next: (response: any) => {
          this.notifiService.success('Sửa thông tin phương tiện thành công')
          this.form.disable()
          this.isFixEmployeeButton = false
        },
        error: (error: any) => {
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

  nameOfPDF(): string {
    const now = new Date()
    const date = now.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '_');
    return `Thongtinphuongtien-${this.idDetail}-${date}`
  }

  pdfExport() {
    this.vehicle.printVehicleDetail(this.inforVehicle).subscribe((response: any) => {
      const base64 = response.data
      console.log(base64)
      const blob = PDF.base64ToBlob(base64, 'application/pdf')
      // const blob = this.base64ToBlob(base64, 'application/pdf')
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.nameOfPDF()}.pdf`
      a.click();
      // this.notification.success('Xuất file thành công!')
      // Dọn dẹp bộ nhớ
      window.URL.revokeObjectURL(url);
    })
  }





}

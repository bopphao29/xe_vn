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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IData } from '../../models-employee/setup-profile-employee/index.model';
import { Observable, Observer } from 'rxjs';
import { UserServiceService } from '../../shared/user-service/user-service.service';

interface FileCompressed {
  contractFile: File[];
  healthCertificate: File[];
  file: (File | null)[];
}

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
    NzTabsModule,
    NzUploadModule,


  ],
  templateUrl: './setup-profile-employee.component.html',
  styleUrl: './setup-profile-employee.component.scss'
})
export class SetupProfileEmployeeComponent implements OnInit {

  date = null;
  isEnglish = false;
  fileList: NzUploadFile[] = [];
  fileCompressed :FileCompressed = {
    contractFile: [],
    healthCertificate: [],
    file: []
  };
  form: FormGroup;

  data: IData = {
    name: null,
    yearOfBirth: null,
    gender: null,
    identifierId: null,
    phoneNumber: null,
    zalo: null,
    contractDuration: null,
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
    contractFile: null,
    fileContract: null,
    isLimitedTime: null,
    branchId: 0,
    departmentId: null,
    positionId: null,
    routeId: null,
    businessCardNumber: null,
    bcStartDate: null,
    bcEndDate: null,
    officeId: null,
    bcImage: null,
    healthCertificate: null,
    hcEndDate: null,
    driverLicenseNumber: null,
    driverLicenseType: null,
    dlStartDate: null,
    dlEndDate: null,
    dlImage: null,
    lstChildren: [{
      name: null,
      yearOfBirth: null,
      gender: null
    }],
    lstArchivedRecords: [{
      name: null,
      code: null,
      type: null,
      file: null
    }]
  }

  file = true
  isShowModalUploadfile = false
  isModalInforEmployee = false
  isDriver: boolean = false
  loading = false;
  avatarUrl?: string;
  inforEmployee : any = {}

  userId: number = 2
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private userSevice: UserServiceService
  ) {
    this.form = this.fb.group(this.data)
  }

  ngOnInit(): void {
    this.form = this.fb.group({
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
      contractDuration: null,
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
      contractFile: null,
      bcImage: null,
      healthCertificate: null,
      officeId: null,
      dlImage: null,
      hcEndDate: null,
      driverLicenseNumber: null,
      driverLicenseType: null,
      dlStartDate: null,
      dlEndDate: null,
      lstChildren: this.fb.array(this.data.lstChildren.map(child => this.createlstChildren(child))),
      lstArchivedRecords: this.fb.array(this.data.lstArchivedRecords.map(record => this.createArchivedRecords(record)))
    })
    this.checkDriver()  

    // this.getUser(this.userId)
  }

  get lstArchivedRecords(): FormArray {
    return this.form.get('lstArchivedRecords') as FormArray;
  }

  get lstChildren(): FormArray {
    return this.form.get('lstChildren') as FormArray;
  }

  createArchivedRecords(record: { name: string | null; code: string | null; type: string | null; file: string | null }): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      type: ['', Validators.required],
      file: ['']
    });
  }

  createlstChildren(child: { name: string | null; yearOfBirth: string | null; gender: string | null }): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      yearOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }



  addArchivedRecords() {
    this.lstArchivedRecords.push(this.createArchivedRecords({
      name: null,
      code: null,
      type: null,
      file: null
    }));

    this.fileCompressed.file.push(null);
  }

  addlstChildren() {
    this.lstChildren.push(this.createlstChildren({
      name: null,
      yearOfBirth: null,
      gender: null
    }));
  }

  removeArchivedRecord(index: number) {
    this.lstArchivedRecords.removeAt(index)
  }

  removelstChildren(index: number) {
    this.lstChildren.removeAt(index)
  }

  showModalInforEmployee() {
    this.isModalInforEmployee = true
    this.inforEmployee = this.form.value
    // this.loading = true
    this.saveDataEmployee()
  }

  getNameInput(name: string, type : 'branch' | 'department' | 'office' | 'position' | 'route' | 'driverLicense'){
    const branchData: { [key: string]: string } = {
      '1': 'VTHK'
    };
  
    const departmentData: { [key: string]: string } = {
      '1': 'VTHK'
    };
  
    const officeData: { [key: string]: string } = {
      '1': 'Marketing',
      '2': 'Lái xe',

    };
    const positionData: { [key: string]: string } = {
      '1': 'Lái xe tuyến',
      '2': 'Lái xe thời vụ'
    };
    const routeData: { [key: string]: string } = {
      '1': 'Nam định',
      '2': 'Hà Nam'
    };
    const driverLicenseTypeData: { [key: string]: string } = {
      '1': 'D',
      '2': 'E'
    };
    let data;
  switch (type) {
    case 'branch':
      data = branchData;
      break;
    case 'department':
      data = departmentData;
      break;
    case 'office':
      data = officeData;
      break;
    case 'position':
      data = positionData;
      break;
    case 'route':
      data = routeData;
      break;
    case 'driverLicense':
        data = driverLicenseTypeData;
        break;
    default:
      data = {};
  }
  
    return data[name] || '';
  }

  handleCancel() {
    this.isModalInforEmployee = false
  }

  handleSubmit(): void {
    this.isModalInforEmployee = false;
  }

  //check driver => show input
  checkDriver() {
    this.form.get('officeId')?.valueChanges.subscribe((value: any) => {
      this.isDriver = value === '2';

    })
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

  bcImagePreview: string | null = null;
cardImagePreview: string | null = null;

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

  onFileSelected(event: any): Observable<File> {
    return new Observable((observer: Observer<File>) => {
      const file: File = event.target.files[0];
      if (file) {
        observer.next(file)
        observer.complete()
      }
      else {
        observer.error('Error')
      }
    })
  }

  onChange(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        const file = input.files[0]; // Lấy file đầu tiên

        if (field === 'contractFile') {
            this.fileCompressed.contractFile = [file]; // Chỉ lưu một file
            // Cập nhật giá trị cho FormControl
            this.form.patchValue({ contractFile: file.name }); // Thay yourFormGroup bằng tên biến FormGroup của bạn
        } else if (field === 'healthCertificate') {
            this.fileCompressed.healthCertificate = [file]; 
            // Cập nhật giá trị cho FormControl
            this.form.patchValue({ healthCertificate: file.name }); // Thay yourFormGroup bằng tên biến FormGroup của bạn
        }
    }
}


  onFileChange(event: any,fieldName: 'file', index : number): void {
    this.onFileSelected(event).subscribe({
      next: (file: File) => {
        const fileList: FileList = event.target.files;

        if (fileList.length > 0) {
          const file = fileList[0]; 
          this.fileCompressed.file[index] = file; 
  
          if (fieldName === 'file') {
              this.lstArchivedRecords.at(index).patchValue({ file: file.name });
          }
      }
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {

      }
    })
  }

  isoDate: string | null = null;

// Hàm xử lý thay đổi ngày
onDateChange(date: Date): void {
  if (date) {
    this.isoDate = date.toISOString(); // Chuyển đổi sang ISO 8601
    console.log(this.isoDate)
  } else {
    this.isoDate = null;
  }
}

  getUser(id: any) {
    this.userId = id
    console.log(id)
    this.userSevice.getDetailEmployee(id).subscribe((response: any) => {
      console.log(response.data)
    })
  }

  saveDataEmployee() {
    const dataForm = {
      ...this.form.value,
      lstArchivedRecords: this.form.value.lstArchivedRecords.map((record: any) => ({
        name: record.name,
        code: record.code,
        type: record.type,
        file: record.file,
      })),
      lstChildren: this.form.value.lstChildren.map((child: any) => ({
        name: child.name,
        yearOfBirth: child.yearOfBirth,
        gender: child.gender,
      })),
    };
    const formData = new FormData();
    formData.append('data', JSON.stringify(dataForm));
    if (this.fileCompressed.healthCertificate.length > 0) {
      formData.append('healthCertificate', this.fileCompressed.healthCertificate[0]);
  }

  if (this.fileCompressed.contractFile.length > 0) {
      formData.append('contractFile', this.fileCompressed.contractFile[0]);
  }

    dataForm.lstArchivedRecords.forEach((record: any, index: number) => {
      console.log(`Record ${index + 1}:`, record);
      if (!record.name || !record.code || !record.type || !record.file) {
          console.error(`Record ${index + 1} có trường bị thiếu hoặc null.`);
      }
  });

  // Log từng phần tử trong lstChildren
  console.log("lstChildren:");
  dataForm.lstChildren.forEach((child: any, index: number) => {
      console.log(`Child ${index + 1}:`, child);
      if (!child.name || !child.yearOfBirth || !child.gender) {
          console.error(`Child ${index + 1} có trường bị thiếu hoặc null.`);
      }
  });

  dataForm.lstArchivedRecords.forEach((record: any, index: number) => {
    const file = this.form.value.lstArchivedRecords[index].file;
    if (file) {
        formData.append(`file_${index}`, file); // key là 'file_0', 'file_1', ...
    } else {
        console.error(`Record ${index + 1} thiếu file.`);
    }
});

    Object.keys(dataForm).forEach(value => {
      formData.append(value, dataForm[value])
    })

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

    this.userSevice.saveEmployee(formData).subscribe({
      next: (response) => {
          console.log('File đã được gửi đi thành công', response);
      },
      error: (error) => {
          console.error('Lỗi khi gửi file:', error);
      }
  })
  }
}

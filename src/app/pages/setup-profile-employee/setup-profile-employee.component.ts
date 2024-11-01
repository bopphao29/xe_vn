import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
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
import { Observable, Observer, of } from 'rxjs';
import { UserServiceService } from '../../shared/user-service/user-service.service';
import { NotificationService } from '../../shared/services/notification.service';


interface FileCompressed {
  contractFile: File[];
  healthCertificate: File[];
  file: File[];

}

interface ArchivedRecord {
  name: string;
  code: string;
  type: string;
  file: File;
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
  fileCompressed: FileCompressed = {
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
    // contractDuration: null,
    email: null,
    hasChild: null,
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
    contractFile: null,
    branchId: 0,
    departmentId: null,
    positionId: null,
    routeId: null,
    businessCardNumber: null,
    bcStartDate: null,
    bcEndDate: null,
    officeId: null,
    hcEndDate: null,
    driverLicenseNumber: null,
    driverLicenseType: null,
    dlStartDate: null,
    dlEndDate: null,
    // archivedRecordFiles: [],
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
    }],
    contract: {
      id: null,
      type: null,
      signDate: null,
    }
  }

  file = true
  isShowModalUploadfile = false
  isModalInforEmployee = false

  loading = false;
  avatarUrl?: string;
  inforEmployee: any = {}

  userId: number = 2
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private userSevice: UserServiceService,
    private notification: NotificationService,

  ) {
    this.form = this.fb.group(this.data)
  }

  maxYear: number = 0
  minYear: number = 0

  ngOnInit(): void {
    //khởi tạo form ban đầu
    var year = new Date()
    const maxYear = (year.getFullYear() - 18)
    const minYear = (year.getFullYear() - 60)
    this.maxYear = maxYear
    this.minYear = minYear

    this.form = this.fb.group({
      name: [null, Validators.required],
      yearOfBirth: [null, [Validators.required, Validators.min(minYear), Validators.max(maxYear)]],
      gender: [null, Validators.required],
      identifierId: [null, [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      phoneNumber: [null, [Validators.required, Validators.pattern('^[0]+[1-9]{9}$')]],
      zalo: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      ethnicGroup: [null, Validators.required],
      religion: [null, Validators.required],
      professionalLevel: [null, Validators.required],
      maritalStatus: [null, Validators.required],
      contactPerson: [null, Validators.required],
      contractFile: [null, Validators.required],
      contactPersonPhone: [null, [Validators.required, Validators.pattern('^[0]+[1-9]{9}$')]],
      // contractDuration: [null, Validators.required],
      staffRelation: [null, Validators.required],
      permanentAddress: [null, Validators.required],
      temporaryAddress: [null, Validators.required],
      contractType: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      branchId: [null, Validators.required],
      departmentId: [null, Validators.required],
      officeId: [null, Validators.required],
      routeId: [null, Validators.required],
      positionId: [null, Validators.required],
      businessCardNumber: [null, Validators.required],
      bcStartDate: [null, Validators.required],
      bcEndDate: [null, Validators.required],
      hcEndDate: [null, Validators.required],
      driverLicenseNumber: [null, Validators.required],
      driverLicenseType: [null, Validators.required],
      dlStartDate: [null, Validators.required],
      dlEndDate: [null, Validators.required],
      hasChild: [null, Validators.required],
      bcImage: [[], Validators.required],
      healthCertificate: [[], Validators.required],
      dlImage: [[], Validators.required],
      // archivedRecordFiles: [],
      lstChildren: this.fb.array(this.data.lstChildren.map(child => this.createlstChildren(child))),
      lstArchivedRecords: this.fb.array(this.data.lstArchivedRecords.map(record => this.createArchivedRecords(record))),
      contract: this.fb.group({
        id: '',
        type: [0, Validators.required],
        signDate: [null, Validators.required]
      })
    })
    this.checkDriver()
    this.checkChild()
    this.checkWork()
    // this.getUser(this.userId)
    this.getBranch()
    this.getDepartment()
    this.getOffice()
    this.getPossition()
    this.getRoute()


  }


  listBranch: any[] = []
  listPosstion: any[] = []
  listOffice: any[] = []
  listDepartment: any[] = []
  listRoute: any[] = []

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getBranch() {
    this.userSevice.getBranch().subscribe((response: any) => {
      this.listBranch = response.data
    })
  }

  getPossition() {
    this.userSevice.getPossition().subscribe((response: any) => {
      this.listPosstion = response.data
    })
  }

  getOffice() {
    this.userSevice.getOffice().subscribe((response: any) => {
      this.listOffice = response.data
    })
  }

  getDepartment() {
    this.userSevice.getDepartment().subscribe((response: any) => {
      this.listDepartment = response.data
    })
  }

  getRoute() {
    this.userSevice.getRoute().subscribe((response: any) => {
      this.listRoute = response.data
    })
  }

  //tạo form array
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
      file: ['', Validators.required]
    });
  }

  maxYearChild: number = 0
  minYearChild: number = 0

  createlstChildren(child: { name: string | null; yearOfBirth: string | null; gender: string | null }): FormGroup {
    var year = new Date()
    const maxYear = year.getFullYear()
    const minYear = (year.getFullYear() - 42)
    this.maxYearChild = maxYear
    this.minYearChild = minYear
    return this.fb.group({
      name: ['', Validators.required],
      yearOfBirth: ['', [Validators.required, Validators.min(minYear), Validators.max(maxYear)]],
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

    // this.fileCompressed.file.push(null);
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

  // lấy giá trị trong các trường
  getNameInput(name: string, type: 'driverLicense') {
    const driverLicenseTypeData: { [key: string]: string } = {
      '1': 'D',
      '2': 'E'
    };
    let data;
    switch (type) {
      case 'driverLicense':
        data = driverLicenseTypeData;
        break;
      default:
        data = {};
    }

    return data[name] || '';// trả về tên
  }

  handleCancel() {
    this.isModalInforEmployee = false
    this.listAR = [];
    this.listCh = [];
  }

  handleSubmit(): void {
    this.isModalInforEmployee = false;
  }



  ///////////////////////////////////////////////////////////////CHECK////////////////////////////////////////////////////////////////////////////
  //check driver => show input
  idDriver: number = -10
  hasDriver: boolean = false
  checkDriver() {
    this.form.get('departmentId')?.valueChanges.subscribe((value: any) => {
      console.log(value)
      this.idDriver = value // 1
      const isDriver = this.listDepartment.find(item => item.id === this.idDriver)
      console.log(isDriver)
      var codeDriver: any = isDriver.code
      if (isDriver && codeDriver == 'DRIVER' && codeDriver != null) {
        this.hasDriver = true
      }
    })
  }

  hasChildren: number = -10

  checkChild() {
    this.form.get('hasChild')?.valueChanges.subscribe((value: any) => {
      this.hasChildren = value
      console.log(this.hasChildren)

    })
  }

  checkContractType: number = 0
  checkWork() {
    this.form.get('contractType')?.valueChanges.subscribe((value: any) => {
      this.checkContractType = value
    })
  }



  ////////////////////////////////////////////////////////////////////////////////FILE/////////////////////////////////////////////////////


  // beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> => {
  //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  //   const isLt2M = file.size! / 1024 / 1024 < 2;

  //   if (!isJpgOrPng) {
  //     this.msg.error('You can only upload JPG/PNG files!');
  //     return of(false); 
  //   }
  //   if (!isLt2M) {
  //     this.msg.error('Image must be smaller than 2MB!');
  //     return of(false); 
  //   }

  //   return of(true); 
  // };

  // private getBase64(img: File, callback: (img: string) => void): void {
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => callback(reader.result!.toString()));
  //   reader.readAsDataURL(img);
  // }
  previewUrl: string | ArrayBuffer | null = null; // Show url ảnh
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  bcImageName: string = ''; // Tên file hình ảnh GPLX
  dlImageName: string = ''; // Tên file hình ảnh giấy phép lái xe
  isBcImageVisible: boolean = true; // Hiện thị input Hình ảnh thẻ nghiệp vụ
  isDlImageVisible: boolean = false; // Hiện thị input Hình ảnh GPLX


  bcImgFile: File[] = []
  dlImage: File[] = []



  handleFileInput(event: Event, field: 'bcImage' | 'dlImage'): void {//tạo field có tên bcImage or dlImage
    const target = event.target as HTMLInputElement; // tạo biến, khi click sự kiện (HTMLInputElement: 1 kiểu trong html)
    if (target.files && target.files.length > 0) { // nếu là files và có file
      const file = target.files[0]; // tạo biến để lưu giá trị đầu tiên khi chọn

      if (field === 'bcImage') {//check name với formControllName
        this.bcImageName = file.name; // Tên file hình ảnh thẻ nghiệp vụ
        this.bcImgFile = [file]
      } else if (field === 'dlImage') {
        this.dlImageName = file.name; // Tên file hình ảnh GPLX
        this.dlImage = [file]

      }
      const reader = new FileReader();//tạo biến để đọc file dạng url
      reader.onload = (e) => { //reader.onload hàm call back sau khi đọc xong file
        if (typeof e.target?.result === 'string') { // Kiểm tra kiểu
          this.previewUrl = e.target.result; // Lưu URL của hình ảnh
        }
      };
      reader.readAsDataURL(file);//=> nhìn thấy được ảnh

    }

  }

  openFileModal(field: 'bcImage' | 'dlImage'): void {// file này để lưu tên trường , để tật modal theo file tên gì
    // this.isShowModalUploadfile = true;
    if (field === 'bcImage') {
      this.isBcImageVisible = true;
      this.isDlImageVisible = false;
      this.isShowModalUploadfile = true;
    } else {
      this.isBcImageVisible = false;
      this.isDlImageVisible = true;
      this.isShowModalUploadfile = true;
    }
    // Điều khiển hiển thị các input
    // vì cùng 1 modal nên nên khi bật nên phải khởi tạo khởi tạo lại các giá trị
    this.selectedFile = null;// 
    this.previewUrl = null;//
  }



  beforeUpload = (file: NzUploadFile): boolean => {// sau khi file được tải lên
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'; //lọc file png 
    if (!isJpgOrPng) { // check điều kiện
      this.msg.error('Bạn chỉ có thể tải lên file JPG hoặc PNG!');
    }
    return isJpgOrPng; // Ngăn không cho tải lên file không hợp lệ
  };


  onFileSelected(event: any): Observable<File> {
    return new Observable((observer: Observer<File>) => {// tạo observable mới
      const file: File = event.target.files[0];// tạo biến nhận giá trị đầu tiên của file
      if (file) { // nếu có file thì tiếp tục
        observer.next(file)
        observer.complete()
      }
      else {
        observer.error('Error')
      }
    })
  }

  onChange(event: Event, field: string) {
    const input = event.target as HTMLInputElement;// sự kiến ckick trong html
    if (input.files && input.files.length > 0) {// nếu là file và có file
      const file = input.files[0]; // Lấy file đầu tiên

      if (field === 'contractFile') {// nếu tên field = contractFile
        this.fileCompressed.contractFile = [file]; // Chỉ lưu một file
        // Cập nhật giá trị cho FormControl contracfile = file[]
        this.form.patchValue({ contractFile: [file] });
      } else if (field === 'healthCertificate') { //nếu tên field = healthCertificate
        this.fileCompressed.healthCertificate = [file];
        // Cập nhật giá trị cho FormControl
        this.form.patchValue({ healthCertificate: [file] });
      }
    }
  }

  onChangeImage(event: Event, field: string) {
    // this.isShowModalUploadfile = true;
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];

      if (field === 'bcImage') {
        this.isBcImageVisible = true;
        this.isDlImageVisible = false;
        this.bcImageName = file.name
        this.bcImgFile = [file]
        this.form.patchValue({ bcImage: [file] })
      } else if (field === 'dlImage') {
        this.isBcImageVisible = false;
        this.isDlImageVisible = true;
        this.dlImageName = file.name
        this.dlImage = [file]
        this.form.patchValue({ dlImage: [file] })
      }
    }
  }

  onChangeImg(event: Event): void {//
    this.onFileSelected(event).subscribe({// trả về observable
      next: (file: File) => {
        this.selectedFile = file;

        // Tạo preview cho hình ảnh
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result;
        };
        reader.readAsDataURL(file);
      },
      error: (error) => {
        console.error('Lỗi khi chọn file:', error);
      }
    });
  }


  onFileChange(event: any, fieldName: any, index: number): void {
    this.onFileSelected(event).subscribe({//
      next: (file: File) => {
        const fileList: FileList = event.target.files; // danh sách file được chọn 

        if (fileList.length > 0) {// nếu list > 0
          const file = fileList[0];// file đầu danh sách
          this.fileCompressed.file[index] = file;// lưu vào mảng tại vị trí index

          if (fieldName === 'file') {
            this.lstArchivedRecords.at(index).patchValue({ file: file });// cấp nhật giá trị nếu fieldName = file
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



  /////////////////////////////////////////////////////////////////////////DATE/////////////////////////////////////////////////////////////
  // Hàm xử lý thay đổi ngày
  onDateChange(date: Date): void {
    if (date) {
      this.isoDate = date.toISOString(); // Chuyển đổi sang ISO 8601
      // console.log(this.isoDate)
    } else {
      this.isoDate = null;
    }

    this.form.get('toDate')?.updateValueAndValidity()
  }


  startValue: Date | null = null
  endValue: Date | null = null

  disableIntoToDate = (toDate: Date): boolean => {
    const fromDate = this.form.get('fromDate')?.value
    return fromDate ? toDate <= fromDate : false

  }

  ///////////////////////////////////////////////////////////////////////SHOW DATA///////////////////////////////////////////////////////////////////////
  officeEmployee: any
  officeName: any
  branchEmployee: any
  branchName: any
  positionEmloyee: any
  positionName: any
  deparmentEmployee: any
  deparmentName: any
  routeEmployee: any
  routeName: any
  listAR: any[] = []
  listCh: any[] = []

  showDataEmployee() {
    this.inforEmployee = this.form.value
    this.form.get('name')?.markAsTouched()
    this.form.get('yearOfBirth')?.markAsTouched()
    this.form.get('gender')?.markAsTouched()
    this.form.get('identifierId')?.markAsTouched()
    this.form.get('phoneNumber')?.markAsTouched()
    this.form.get('zalo')?.markAsTouched()
    this.form.get('email')?.markAsTouched()
    this.form.get('ethnicGroup')?.markAsTouched()
    this.form.get('religion')?.markAsTouched()
    this.form.get('professionalLevel')?.markAsTouched()
    this.form.get('maritalStatus')?.markAsTouched()
    this.form.get('contactPerson')?.markAsTouched()
    this.form.get('contractFile')?.markAsTouched()
    this.form.get('contactPersonPhone')?.markAsTouched()
    this.form.get('staffRelation')?.markAsTouched()
    this.form.get('permanentAddress')?.markAsTouched()
    this.form.get('temporaryAddress')?.markAsTouched()
    this.form.get('contractType')?.markAsTouched()
    this.form.get('fromDate')?.markAsTouched()
    this.form.get('toDate')?.markAsTouched()
    this.form.get('branchId')?.markAsTouched()
    this.form.get('departmentId')?.markAsTouched()
    this.form.get('officeId')?.markAsTouched()
    this.form.get('positionId')?.markAsTouched()
    //////////////////LX//////////////////////////////
    if (this.hasDriver == true) {
      this.form.get('routeId')?.markAsTouched()
      this.form.get('businessCardNumber')?.markAsTouched()
      this.form.get('bcEndDate')?.markAsTouched()
      this.form.get('bcStartDate')?.markAsTouched()
      this.form.get('bcImage')?.markAsTouched()
      this.form.get('healthCertificate')?.markAsTouched()
      this.form.get('driverLicenseNumber')?.markAsTouched()
      this.form.get('driverLicenseType')?.markAsTouched()
      this.form.get('dlStartDate')?.markAsTouched()
      this.form.get('dlEndDate')?.markAsTouched()
      this.form.get('dlImage')?.markAsTouched()
      this.form.get('hcEndDate')?.markAsTouched()
    }
    this.form.get('hasChild')?.markAsTouched()
    this.lstArchivedRecords.controls.forEach((value: any) => {
      value.get('name')?.markAsTouched();
      value.get('code')?.markAsTouched();
      value.get('type')?.markAsTouched();
      value.get('file')?.markAsTouched();
    })
    this.lstChildren.controls.forEach((value: any) => {
      value.get('name')?.markAsTouched();
      value.get('gender')?.markAsTouched();
      value.get('yearOfBirth')?.markAsTouched();
    })
    const dataForm = {
      ...this.form.value,
      lstArchivedRecords: this.form.value.lstArchivedRecords.map((record: any) => ({// trong form Array
        name: record.name,
        code: record.code,
        type: record.type,
        file: record.file.name,
      })),
      lstChildren: this.form.value.lstChildren.map((child: any) => ({
        name: child.name,
        yearOfBirth: child.yearOfBirth,
        gender: child.gender,
      })),

    };

    // console.log(this.lstArchivedRecords)
    this.lstArchivedRecords.controls.forEach((value: any, index: number) => {
      // console.log(value.value)
      this.listAR.push(value.value)
    })

    if (this.lstChildren) {
      this.lstChildren.controls.forEach((value: any, index: number) => {
        // console.log(value.value)
        this.listCh.push(value.value)
      })
    }

    delete dataForm.contractFile
    // delete dataForm.bcImage
    delete dataForm.healthCertificate
    // delete dataForm.dlImage
    //office => đã có id => timf tên theo id
    this.officeEmployee = dataForm.officeId
    const officeIndex = this.listOffice.find(item => item.id === this.officeEmployee)
    if (dataForm.officeId) {
      this.officeName = officeIndex.name
    }
    //deparment
    this.deparmentEmployee = dataForm.departmentId
    const deparmentIndex = this.listDepartment.find(item => item.id === this.deparmentEmployee)
    if (dataForm.departmentId) {
      this.deparmentName = deparmentIndex.name
    }
    //branch
    this.branchEmployee = dataForm.branchId
    const branchIndex = this.listBranch.find(item => item.id === this.branchEmployee)
    if (dataForm.branchId) {
      this.branchName = branchIndex.name
    }
    //position
    this.positionEmloyee = dataForm.positionId
    const positionIndex = this.listPosstion.find(item => item.id === this.positionEmloyee)
    if (dataForm.positionId) {
      this.positionName = positionIndex.name
    }
    //route
    this.routeEmployee = dataForm.routeId
    const routeIndex = this.listRoute.find(item => item.id === this.routeEmployee)
    if (dataForm.routeId) {
      this.routeName = routeIndex.name
    }

    const formData = new FormData();

    formData.append('data', JSON.stringify(dataForm));
    if (this.fileCompressed.healthCertificate.length > 0) {
      formData.append('healthCertificate', this.fileCompressed.healthCertificate[0]);
    }
    if (this.fileCompressed.contractFile.length > 0) {
      formData.append('contractFile', this.fileCompressed.contractFile[0]);
    }
    var archivedRecordFile: any = this.fileCompressed.file

    archivedRecordFile.forEach((value: any) => {
      formData.append('archivedRecordFiles', value)
    })
    if (this.dlImage[0]) {
      formData.append('dlImage', this.dlImage[0]);
    }
    if (this.bcImgFile[0]) {
      formData.append('bcImage', this.bcImgFile[0]);
    }

    // if(this.form.invalid){
    //   this.isModalInforEmployee = false
    // }else{
    //   this.isModalInforEmployee = true


    // }

    if (this.form.valid) {
      this.isModalInforEmployee = true
    } else {
      this.listAR = [];
      this.listCh = [];
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

    // this.userSevice.saveEmployee(formData).subscribe({
    //   next: (response) => {
    //     console.log('File đã được gửi đi thành công', response);
    //     this.notification.success('Lưu hồ sơ nhân viên thành công!')
    //     this.isModalInforEmployee = true
    //     // this.form.reset()
    //   },
    //   error: (error) => {
    //     // if(error.status === 400){
    //     //   this.notification.error(error.message)
    //     // }

    //   }
    // })



  }

  deparmentCode = '' 
  saveDataEmployee() {

    this.form.get('departmentId')?.valueChanges.subscribe((value: any)=>{
      this.idDriver = value // 1
      const isDriver = this.listDepartment.find(item => item.id === this.idDriver)
      var codeDriver: any = isDriver.code
      if (isDriver && codeDriver == 'DRIVER' && codeDriver != null) {
        this.deparmentCode = codeDriver
      }
    })

    const dataForm = {
      ...this.form.value,
      deparmentCode: this.deparmentCode,
      lstArchivedRecords: this.form.value.lstArchivedRecords.map((record: any) => ({// trong form Array
        name: record.name,
        code: record.code,
        type: record.type,
        file: record.file.name,
      })),
      lstChildren: this.form.value.lstChildren.map((child: any) => ({
        name: child.name,
        yearOfBirth: child.yearOfBirth,
        gender: child.gender,
      })),

    };

    // console.log(this.lstArchivedRecords)
    this.lstArchivedRecords.controls.forEach((value: any, index: number) => {
      console.log(value.value)
      this.listAR.push(value.value)
    })

    if (this.lstChildren) {
      this.lstChildren.controls.forEach((value: any, index: number) => {
        console.log(value.value)
        this.listCh.push(value.value)
      })
    }

    delete dataForm.contractFile
    delete dataForm.bcImage
    delete dataForm.healthCertificate
    delete dataForm.dlImage

    const formData = new FormData();

    formData.append('data', JSON.stringify(dataForm));
    if (this.fileCompressed.healthCertificate.length > 0) {
      formData.append('healthCertificate', this.fileCompressed.healthCertificate[0]);
    }
    if (this.fileCompressed.contractFile.length > 0) {
      formData.append('contractFile', this.fileCompressed.contractFile[0]);
    }
    var archivedRecordFile: any = this.fileCompressed.file

    archivedRecordFile.forEach((value: any) => {
      formData.append('archivedRecordFiles', value)
    })
    if (this.dlImage[0]) {
      formData.append('dlImage', this.dlImage[0]);
    }
    if (this.bcImgFile[0]) {
      formData.append('bcImage', this.bcImgFile[0]);
    }
    // console.log(formData)


    this.userSevice.saveEmployee(formData).subscribe({
      next: (response) => {
        console.log('File đã được gửi đi thành công', response);
        this.notification.success('Lưu hồ sơ nhân viên thành công!')
        // this.isModalInforEmployee = true
        // this.form.reset()
      },
      error: (error) => {
        // if(error.status === 400){
        //   this.notification.error(error.message)
        // }

      }
    })
  }

  /////////////////////////////////////////////////////EXPORT PDF//////////////////////////////////////////////////////////////////////////




}

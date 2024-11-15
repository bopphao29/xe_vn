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
import { from, Observable, Observer, of } from 'rxjs';
import { IData } from '../../../../models/setup-profile-car/models-employee/setup-profile-employee/index.model';
import { UserServiceService } from '../../../../shared/services/user-service.service';

import { NotificationService } from '../../../../shared/services/notification.service';
import { PDFDocument, rgb } from 'pdf-lib';
import { PdfService } from '../../../../shared/pdf/pdf.service';
import { Router } from '@angular/router';

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
    contract: [{
      id: null,
      file: null,
      type: null,
      signDate: null,
    }]
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
    private pdfService: PdfService,
    private routes: Router
  ) {
    this.form = this.fb.group(this.data)
  }

  maxYear: number = 0
  minYear: number = 0
  contract_type: number = 1
  has_child : any
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
      contractFile: [null],
      contactPersonPhone: [null, [Validators.required, Validators.pattern('^[0]+[1-9]{9}$')]],
      // contractDuration: [null, Validators.required],
      staffRelation: [null, Validators.required],
      permanentAddress: [null, Validators.required],
      temporaryAddress: [null, Validators.required],
      contractType: ['1', Validators.required],
      fromDateOfOffical: [null],
      fromDateProbation: [null],
      // fromDate: [null, Validators.required],
      toDate: [null],
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
      hasChild: ['0', Validators.required],
      bcImage: [[], Validators.required],
      healthCertificate: [[], Validators.required],
      dlImage: [[], Validators.required],
      // archivedRecordFiles: [],
      lstChildren: this.fb.array(this.data.lstChildren.map(child => this.createlstChildren(child))),
      lstArchivedRecords: this.fb.array(this.data.lstArchivedRecords.map(record => this.createArchivedRecords(record))),
      contract: this.fb.array(this.data.contract.map(contract => this.createContract(contract)))
    })
    this.checkDriver()
    this.checkChild()
    this.checkWork()
    this.getBranch()
    this.getOffice()
    this.getPossition()
    this.getRoute()
    this.getDriverLicense()

    this.form.get('contractType')?.valueChanges.subscribe((value: any)=> {
      console.log(value)
      this.contract_type = value
    })

    this.form.get('hasChild')?.valueChanges.subscribe((value: any)=>{
      this.has_child = value
    })
  }

  deparmentCode = '' 
  listBranch: any[] = []
  listPosstion: any[] = []
  listOffice: any[] = []
  listDepartment: any[] = []
  listRoute: any[] = []
  driverLicense: any[] = []

  listDuration = [
    {id: 1, value:"Hợp đồng 1 năm"},
    {id: 2, value:"Hợp đồng 3 năm"},
    {id: 3, value:"Hợp đồng vô thời hạn"}

  ]

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getBranch() {
    this.userSevice.getBranch().subscribe((response: any) => {
      this.listBranch = response.data
    })
  }

  getDriverLicense(){
    this.userSevice.getDriverLicense().subscribe((response: any)=>{
      this.driverLicense = response.data
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

    this.getDepartment()
  }

  getDepartment() {
    var idOffice :number =0
    this.form.get('officeId')?.valueChanges.subscribe((value: any)=> {
     idOffice = value
      console.log(idOffice)
     if(idOffice != null){
      this.userSevice.getDepartment(idOffice).subscribe((response: any) => {
        this.listDepartment = response.data
        console.log(this.listDepartment)
      })
     }else{
      this.listDepartment = []
     }
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

  get lstcontractDTO(): FormArray {
    return this.form.get('contract') as FormArray;
  }

  get lstChildren(): FormArray {
    return this.form.get('lstChildren') as FormArray;
  }

  createArchivedRecords(record: { name: string | null; code: string | null; type: string | null; file: string | null }): FormGroup {
    return this.fb.group({
      name: [''],
      code: [''],
      type: [''],
      file: ['']
    });
  }

  createContract(contract: { id: string | null; signDate: string | null; type: string | null; file: string | null }): FormGroup {
    return this.fb.group({
      id: [''],
      signDate: ['', Validators.required],
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

    const ChildForm = this.fb.group({
      name:  ['', Validators.required] ,
      yearOfBirth: ['', [Validators.required, Validators.min(minYear), Validators.max(maxYear)]] ,
      gender: ['', Validators.required],
    });

    ChildForm.get('name')?.clearValidators()
        ChildForm.get('yearOfBirth')?.clearValidators()
        ChildForm.get('gender')?.clearValidators()
    this.form.get('hasChild')?.valueChanges.subscribe((value : any)=> {
      console.log(value)
      this.has_child = value
      if(this.has_child === '1' || this.form.get('hasChild')?.value == '1'){
        ChildForm.get('name')?.setValidators(Validators.required)
        ChildForm.get('yearOfBirth')?.setValidators(Validators.required)
        ChildForm.get('gender')?.setValidators(Validators.required)
      }else{
        ChildForm.get('name')?.clearValidators()
        ChildForm.get('yearOfBirth')?.clearValidators()
        ChildForm.get('gender')?.clearValidators()
      }
      ChildForm.get('name')?.updateValueAndValidity();
      ChildForm.get('yearOfBirth')?.updateValueAndValidity();
      ChildForm.get('gender')?.updateValueAndValidity();

    })

    return ChildForm
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

  addContract() {
    this.lstcontractDTO.push(this.createContract({
      id: null,
      signDate: null,
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
      const isDriver = this.listDepartment.find(item => item.id === Number(this.idDriver))
      console.log(isDriver)
      
        var codeDriver: any = isDriver.code
        this.deparmentCode = codeDriver
        console.log(this.deparmentCode)
        if (isDriver && codeDriver == 'DRIVER' && codeDriver != null) {
          this.hasDriver = true
        }
        else{
          this.hasDriver = false
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

  checkContractType: any
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


  handleCancelDone1(){
    this.isDone = false
  }

  handleCancelDone2(){
    this.isDone = false
    this.form.reset
  }
  handleSubmitDone(){
    this.routes.navigate(['employee/list-employee-profile'])
    
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

  onFileChangeContract(event: any, fieldName: any, index: number): void {
    this.onFileSelected(event).subscribe({//
      next: (file: File) => {
        const fileList: FileList = event.target.files; // danh sách file được chọn 

        if (fileList.length > 0) {// nếu list > 0
          const file = fileList[0];// file đầu danh sách
          if (fieldName === 'file') {
            this.fileCompressed.contractFile = [file]

            this.lstcontractDTO.at(index).patchValue({ file: file });// cấp nhật giá trị nếu fieldName = file
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
    const fromDateProbation = this.form.get('fromDateProbation')?.value
    return fromDateProbation ? toDate <= fromDateProbation : false
  }

  disableFromDate = (fromDateProbation: Date): boolean => {
    const toDate = this.form.get('toDate')?.value
    return toDate ? fromDateProbation >= toDate :false
  }

  disableIntobcEndDate = (bcEndDate: Date): boolean => {
    const bcStartDate = this.form.get('bcStartDate')?.value
    return bcStartDate ? bcEndDate <= bcStartDate : false
  }

  disableBcStartDate = (bcStartDate: Date): boolean => {
    const bcEndDate = this.form.get('bcEndDate')?.value
    return bcEndDate ? bcStartDate >= bcEndDate : false
  }

  disabledlEndDate = (dlEndDate : Date) : boolean => {
    const dlStartDate = this.form.get('dlStartDate')?.value
    return dlStartDate ? dlEndDate <= dlStartDate : false
  }

  disabledlStartDate = (dlStartDate : Date) : boolean => {
    const dlEndDate = this.form.get('dlEndDate')?.value
    return dlEndDate ? dlStartDate >= dlEndDate : false
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
    // this.form.markAllAsTouched();
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

    if(this.contract_type == 2){
    this.form.get('fromDateProbation')?.markAsTouched()

    }

    if(this.contract_type == 1){
      this.form.get('fromDateOfOffical')?.markAsTouched()

    }

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
    } else{
      this.form.get('routeId')?.clearValidators();
      this.form.get('businessCardNumber')?.clearValidators();
      this.form.get('bcStartDate')?.clearValidators();
      this.form.get('bcEndDate')?.clearValidators();
      this.form.get('bcImage')?.clearValidators();
      this.form.get('healthCertificate')?.clearValidators();
      this.form.get('hcEndDate')?.clearValidators();
      this.form.get('driverLicenseNumber')?.clearValidators();
      this.form.get('driverLicenseType')?.clearValidators();
      this.form.get('dlStartDate')?.clearValidators();
      this.form.get('dlEndDate')?.clearValidators();
      this.form.get('dlImage')?.clearValidators();
    }
    this.form.get('hasChild')?.markAsTouched()
    // if(this.lstArchivedRecords.value){
    //   this.lstArchivedRecords.controls.forEach((value: any) => {
    //     value.get('name')?.markAsTouched();
    //     value.get('code')?.markAsTouched();
    //     value.get('type')?.markAsTouched();
    //     value.get('file')?.markAsTouched();
    //   })
    // }
    if(this.has_child && this.has_child  == '1' ){
      this.lstChildren.controls.forEach((value: any) => {
        value.get('name')?.markAsTouched();
        value.get('gender')?.markAsTouched();
        value.get('yearOfBirth')?.markAsTouched();
      })
    }
    if(this.lstcontractDTO.value){
      this.lstcontractDTO.controls.forEach((value: any) => {
        value.get('signDate')?.markAsTouched();
        value.get('type')?.markAsTouched();
        value.get('file')?.markAsTouched();
      })
    }
    
    const dataForm = {
      ...this.form.value,
      lstArchivedRecords: this.form.value.lstArchivedRecords && this.form.value.lstArchivedRecords.length > 0 ?  this.form.value.lstArchivedRecords.map((record: any) => ({// trong form Array
        name: record.name,
        code: record.code,
        type: record.type,
        file: record.file.name,
      })): null,
      contract: this.form.value.contract.map((contract : any)=>({
        id: contract.id,
        signDate: contract.signDate,
        type: contract.type,
        file: contract.file.name
      })),
      lstChildren: this.form.value.lstChildren && this.form.value.lstChildren.length > 0 ?  this.form.value.lstChildren.map((child: any) => ({
        name: child.name,
        yearOfBirth: child.yearOfBirth,
        gender: child.gender,
      })): null,

    };

    // console.log(this.lstArchivedRecords)
    if(this.lstArchivedRecords.value){
      this.lstArchivedRecords.controls.forEach((value: any, index: number) => {
        // console.log(value.value)
        this.listAR.push(value.value)
      })
    }else{
      this.listAR = []

    }

    if (this.lstChildren.value) {
      this.lstChildren.controls.forEach((value: any, index: number) => {
        // console.log(value.value)
        this.listCh.push(value.value)
      })
    }else{
      this.listCh = []
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

    this.form.get('routeId')?.updateValueAndValidity()
    this.form.get('businessCardNumber')?.updateValueAndValidity()
    this.form.get('bcStartDate')?.updateValueAndValidity()
    this.form.get('bcEndDate')?.updateValueAndValidity()
    this.form.get('bcImage')?.updateValueAndValidity()
    this.form.get('healthCertificate')?.updateValueAndValidity()
    this.form.get('hcEndDate')?.updateValueAndValidity()
    this.form.get('driverLicenseNumber')?.updateValueAndValidity()
    this.form.get('driverLicenseType')?.updateValueAndValidity()
    this.form.get('dlStartDate')?.updateValueAndValidity()
    this.form.get('dlEndDate')?.updateValueAndValidity()
    this.form.get('dlImage')?.updateValueAndValidity()


    if(this.form.invalid){
      this.isModalInforEmployee == false
      // this.form.markAllAsTouched();
    }else{
      
      this.isModalInforEmployee == true

    }

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

  }

  fromDateOfOffical :any
  fromDateProbation : any

  onContractTypeChange(value: number) {
    this.contract_type = value;

    if (value === 1) { // Nếu chọn "Chính thức"
        this.form.get('fromDateOfOffical')?.setValidators([Validators.required]);
        this.form.get('fromDateProbation')?.clearValidators();
        this.form.get('toDate')?.clearValidators();
    } else if (value === 2) { // Nếu chọn "Thử việc"
        this.form.get('fromDateOfOffical')?.clearValidators();
        this.form.get('fromDateProbation')?.setValidators([Validators.required]);
        this.form.get('toDate')?.setValidators([Validators.required]);
    }

    // Cập nhật lại giá trị và tình trạng của các control sau khi thay đổi validator
    this.form.get('fromDateOfOffical')?.updateValueAndValidity();
    this.form.get('fromDateProbation')?.updateValueAndValidity();
    this.form.get('toDate')?.updateValueAndValidity();
}

isDone : boolean = false
  saveDataEmployee() {

    console.log(this.form.value.lstcontractDTO)

    if(this.contract_type == 1){
      this.fromDateOfOffical = this.form.value.fromDateOfOffical
    }
    if(this.contract_type == 2){
      this.fromDateProbation = this.form.value.fromDateProbation
    }
    const dataForm = {
      ...this.form.value,
      fromDate : this.contract_type == 1 ? this.fromDateOfOffical : this.fromDateProbation ,
      departmentCode: this.deparmentCode,
      lstArchivedRecords: this.form.value.lstArchivedRecords.length === 1 
      && this.form.value.lstArchivedRecords[0].name === '' 
      && this.form.value.lstArchivedRecords[0].code === '' 
      && this.form.value.lstArchivedRecords[0].type === '' 
      && this.form.value.lstArchivedRecords[0].file === '' 
      ? null : this.form.value.lstArchivedRecords.map((record: any) => ({// trong form Array
        name: record.name,
        code: record.code,
        type: record.type,
        file: record.file.name,
      })),
      contract: this.form.value.contract.map((contract : any)=>({
        id: contract.id,
        signDate: contract.signDate,
        type: contract.type,
        file: contract.file.name
      })),
      lstChildren: this.form.value.lstChildren.length === 1
      && this.form.value.lstChildren[0].name === '' 
      && this.form.value.lstChildren[0].yearOfBirth === '' 
      && this.form.value.lstChildren[0].gender === '' 
      ? null :  this.form.value.lstChildren.map((child: any) => ({
        name: child.name,
        yearOfBirth: child.yearOfBirth,
        gender: child.gender,
      })),

    };

    console.log(dataForm)
    delete dataForm.contractFile
    delete dataForm.bcImage
    delete dataForm.healthCertificate
    delete dataForm.dlImage
    delete dataForm.fromDateOfOffical
    delete dataForm.fromDateProbation

    const formData = new FormData();

    formData.append('data', JSON.stringify(dataForm));
    if (this.fileCompressed.healthCertificate.length > 0) {
      formData.append('healthCertificate', this.fileCompressed.healthCertificate[0]);
    }
    // if (this.fileCompressed.contractFile.length > 0) {
    //   formData.append('contractFile', this.fileCompressed.contractFile[0]);
    // }
    var archivedRecordFile: any = this.fileCompressed.file

    console.log(this.fileCompressed.contractFile)
    archivedRecordFile.forEach((value: any) => {
      formData.append('archivedRecordFiles', value)
    })

    var contract_file: any = this.fileCompressed.contractFile
    
    contract_file.forEach((value: any) => {
      formData.append('contractFile', value)
    })

    if (this.dlImage[0]) {
      formData.append('dlImage', this.dlImage[0]);
    }
    if (this.bcImgFile[0]) {
      formData.append('bcImage', this.bcImgFile[0]);
    }
    // console.log(formData)


   if(this.form.valid){
    this.userSevice.saveEmployee(formData).subscribe({
      next: (response) => {
        console.log('File đã được gửi đi thành công', response);
        this.notification.success('Lưu hồ sơ nhân viên thành công!')
        this.isModalInforEmployee = false
        this.isDone = true
      },
      error: (error) => {
        // if(error.status === 400){
        //   this.notification.error(error.message)
        // }

      }
    })
   }else{
          this.notification.error('Có lỗi xảy ra')
          this.listAR = []
   }

    
  }

  /////////////////////////////////////////////////////EXPORT PDF//////////////////////////////////////////////////////////////////////////


  async downloadPDF() {
    const pdfUrl = await this.pdfService.generateEmployeePDF(this.inforEmployee, this.listCh, this.listAR);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'ThongTinNhanSu.pdf';
    link.click();
  }

}

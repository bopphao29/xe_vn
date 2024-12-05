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
import { saveAs } from 'file-saver';
import {PDF} from '../../../../shared/pdf/pdf.util';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from '../../../../shared/services/notification.service';
import { PDFDocument, rgb } from 'pdf-lib';
import { PdfService } from '../../../../shared/pdf/pdf.service';
import { Router } from '@angular/router';
import de from 'date-fns/locale/de';

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
    NzToolTipModule,
    MatTooltipModule

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
      endDate: null,
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
    console.log(localStorage.getItem('activeLink'))
    var year = new Date()
    const maxYear = (year.getFullYear() - 18)
    const minYear = (year.getFullYear() - 60)
    this.maxYear = maxYear
    this.minYear = minYear
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ỹà-ỹ\\s]+$')]],
      yearOfBirth: [null, [Validators.required, Validators.min(minYear), Validators.max(maxYear), Validators.maxLength(4)]],
      gender: [null, Validators.required],
      identifierId: [null, [Validators.required, Validators.pattern(/^(0)[0-9]{11}$/)]],
      phoneNumber: [null, [Validators.required, Validators.pattern(/^(0|84)[0-9]{8,9}$/)]],
      zalo: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      ethnicGroup: [null, Validators.required],
      religion: [null, Validators.required],
      professionalLevel: [null, Validators.required],
      maritalStatus: [null, Validators.required],
      contactPerson: [null, Validators.required],
      contractFile: [null],
      contactPersonPhone: [null, [Validators.required, Validators.pattern(/^(0|84)[0-9]{8,9}$/)]],
      // contractDuration: [null, Validators.required],
      staffRelation: [null, Validators.required],
      permanentAddress: [null, Validators.required],
      temporaryAddress: [null, Validators.required],
      contractType: ['1', Validators.required],
      fromDateOfOffical: [null, Validators.required],
      fromDateProbation: [null, Validators.required],
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
    this.trackFormChanges();
    this.form.get('contractType')?.valueChanges.subscribe((value: any)=> {
      console.log(value)
      this.contract_type = value
    })

    this.form.get('hasChild')?.valueChanges.subscribe((value: any)=>{
      this.has_child = value
      console.log(value)
      if (value == 1) {
        this.lstChildren.controls.forEach(control => {
          control.get("")?.setValidators(Validators.required)
        })
      }
    })

  }

  deparmentCode = '' 
  listBranch: any[] = []
  listPosstion: any[] = []
  listOffice: any[] = []
  listDepartment: any[] = []
  listRoute: any[] = []
  driverLicense: any[] = []


  /////////////////////////////////////Master Data//////////////////////////////////////////////////////////////////////////
  listDuration = [
    {id: 1, value:"Hợp đồng 1 năm"},
    {id: 2, value:"Hợp đồng 3 năm"},
    {id: 3, value:"Hợp đồng vô thời hạn"}

  ]

  listGender = [
    {id: 1, value: "Nam"},
    {id: 2, value: "Nữ"}
  ]

  listMarialStatus = [
    {id: 1, value: "Chưa kết hôn"},
    {id: 2, value: "Đã kết hôn"}
  ]

//////////////////////////////////////validate just enter text input/////////////////
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

  ///////////////////////////////////////////////List data when call api///////////////////////////////////////////////////////////////////

  codeEmployee : any
  getCode(){
    this.userSevice.getCode().subscribe((response: any)=> {
      this.codeEmployee = response.data
    })
  }

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

  //////////////////////////////////////////////////////////Create form array//////////////////////////////////////////////////
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
      name: ['', Validators.required],
      code: ['' , Validators.required],
      type: ['', Validators.required],
      file: ['', Validators.required]
    });
  }

  createContract(contract: { id: string | null; signDate: string | null; endDate: string | null; file: string | null }): FormGroup {
    return this.fb.group({
      id: [''],
      signDate: ['', Validators.required],
      endDate: [''],
      file: ['', Validators.required]
    });
  }

  maxYearChild: number = 0
  minYearChild: number = 0

  createlstChildren(child: { name: string | null; yearOfBirth: number | null; gender: string | null }): FormGroup {
    let year = new Date()
    const maxYear = year.getFullYear()
    const minYear = (year.getFullYear() - 42)
    this.maxYearChild = maxYear
    // console.log(maxYearEmployee)

    const ChildForm = this.fb.group({
      name:  ['', Validators.required] ,
      yearOfBirth: ['', [Validators.required, Validators.min(minYear), Validators.max(this.maxYearChild), Validators.maxLength(4)]] ,
      gender: ['', Validators.required],
    });

    // ChildForm.get('name')?.clearValidators()
    //     ChildForm.get('yearOfBirth')?.clearValidators()
    //     ChildForm.get('gender')?.clearValidators()
    // this.form.get('hasChild')?.valueChanges.subscribe((value : any)=> {
    //   console.log(value)
    //   this.has_child = value
    //   if(this.has_child === '1' || this.form.get('hasChild')?.value == '1'){
    //     ChildForm.get('name')?.setValidators(Validators.required)
    //     ChildForm.get('yearOfBirth')?.setValidators(Validators.required)
    //     ChildForm.get('gender')?.setValidators(Validators.required)
    //   }else{
    //     ChildForm.get('name')?.clearValidators()
    //     ChildForm.get('yearOfBirth')?.clearValidators()
    //     ChildForm.get('gender')?.clearValidators()
    //   }
    //   ChildForm.get('name')?.updateValueAndValidity();
    //   ChildForm.get('yearOfBirth')?.updateValueAndValidity();
    //   ChildForm.get('gender')?.updateValueAndValidity();

    // })
    return ChildForm
  }

  /////////////////////////////////////////////////Add form array////////////////////////////////////////////////////////////
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
      endDate: null,
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

  ////////////////////////////////////////////////funcion delete in form array (archivement, contract, children)////////////////////////////////

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

  //////////////////////////////////////////////////function close modal////////////////////////////////////////////////////////////
  handleCancel() {
    this.isModalInforEmployee = false
    this.listAR = [];
    this.listCh = [];
  }

    
  handleCancelDone1(){
    this.isDone = false
  }

  handleCancelDone2(){
    this.isDone = false
    this.form.reset()
  }

  handleSubmit(): void {
    this.isModalInforEmployee = false;
  }

  ////////////////////////////////////////////////////function routes link///////////////////////////////////////////////////////////
  handleSubmitDone(){
    this.routes.navigate(['employee/list-employee-profile'])
    localStorage.setItem('activeLink','employeeProfile')
  }


  ///////////////////////////////////////////////////funcion check ////////////////////////////////////////////////////////////////////////////
  //check driver => show input
  idDriver: number = -10
  hasDriver: boolean = false


  //Check driver - check when choose list deparment and find item have code == DRIVER
  checkDriver() {
    this.form.get('departmentId')?.valueChanges.subscribe((value: any) => {
      console.log(value)
      this.idDriver = value // 1
      const isDriver = this.listDepartment.find(item => item.id === Number(this.idDriver))
      console.log(isDriver)
      
        if(isDriver){
          var codeDriver: any = isDriver.code
          
          this.deparmentCode = codeDriver
          console.log(this.deparmentCode)
          if (isDriver && codeDriver == 'DRIVER' && codeDriver != null) {
            this.hasDriver = true
          }
          else{
            this.hasDriver = false
            this.form.get('routeId')?.reset()
            this.form.get('businessCardNumber')?.reset()
            this.form.get('bcStartDate')?.reset()
            this.form.get('bcEndDate')?.reset()
            this.form.get('bcImage')?.reset()
            this.form.get('healthCertificate')?.reset()
            this.form.get('hcEndDate')?.reset()
            this.form.get('driverLicenseNumber')?.reset()
            this.form.get('driverLicenseType')?.reset()
            this.form.get('dlStartDate')?.reset()
            this.form.get('dlEndDate')?.reset()
            this.form.get('dlImage')?.reset()
        }
      
        }
    })
  }


  //Check children with hasChild = 1 is have -> show form array lstChildren
  hasChildren: number = -10
  checkChild() {
    this.form.get('hasChild')?.valueChanges.subscribe((value: any) => {
      this.hasChildren = value
      console.log(this.hasChildren)

    })
  }

  //Check contractype => if contractType = 1 is official
  checkContractType: any
  checkWork() {
    this.form.get('contractType')?.valueChanges.subscribe((value: any) => {
      this.checkContractType = value
    })
  }



  /////////////////////////////////////////////////////////////////////////// FILE ///////////////////////////////////////////////////////////////////


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

  beforeUpload = (file: NzUploadFile): boolean => {// sau khi file được tải lên
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'; //lọc file png 
    if (!isJpgOrPng) { // check điều kiện
      this.msg.error('Bạn chỉ có thể tải lên file JPG hoặc PNG!');
    }
    return isJpgOrPng; // Ngăn không cho tải lên file không hợp lệ
  };

  //function onFileSelected is observerble check file
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

  //check healthCertificate
  onChangeHealthCertificate(event: Event) {
    const input = event.target as HTMLInputElement;// sự kiến ckick trong html
    if (input.files && input.files.length > 0) {// nếu là file và có file
      const file = input.files[0]; // Lấy file đầu tiên
      this.fileCompressed.healthCertificate = [file];
      // Cập nhật giá trị cho FormControl
      this.form.patchValue({ healthCertificate: [file] });
    }
  }
 
  //check Business card image and  Driver's license image
  onChangeImage(event: Event, field: string) {
    // this.isShowModalUploadfile = true;
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];

      if (field == 'bcImage') {
        this.isBcImageVisible = true;
        this.isDlImageVisible = false;
        this.bcImageName = file.name
        this.bcImgFile = [file]
        this.form.patchValue({ bcImage: [file] })
      } else if (field == 'dlImage') {
        this.isBcImageVisible = false;
        this.isDlImageVisible = true;
        this.dlImageName = file.name
        this.dlImage = [file]
        this.form.patchValue({ dlImage: [file] })
      }
    }
  }

  
  //function upload lstArchivedRecords file
  onFileChangeAchi(event: any, fieldName: any, index: number): void {
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

//function upload file contract
  onFileChangeContract(event: any, fieldName: any, index: number): void {
    this.onFileSelected(event).subscribe({//
      next: (file: File) => {
        const fileList: FileList = event.target.files; // danh sách file được chọn 

        if (fileList.length > 0) {// nếu list > 0
          const file = fileList[0];// file đầu danh sách
          this.fileCompressed.contractFile[index] = file

          if (fieldName === 'file') {
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

  cleanAchive(){
    this.lstArchivedRecords.reset()
  }

  endClick(){

    this.form.reset({
       contractType : '1',
      hasChild: '0'
    })
  }

  showButtonClean: boolean = false;
  trackFormChanges(): void {
    this.lstArchivedRecords.valueChanges.subscribe(() => {
      this.showButtonClean = this.lstArchivedRecords.controls.some(
        (control) => control.dirty || control.touched
      );
    });
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

  disableSignDate(index: number): (signDate: Date) => boolean {
    return (signDate: Date) => {
      const endDate = this.lstcontractDTO.at(index).get('endDate')?.value;
      return endDate ? signDate >= new Date(endDate) : false;
    };
  }

  disableIntoEndDate(index: number): (endDate: Date) => boolean {
    return (endDate: Date) => {
      const signDate = this.lstcontractDTO.at(index).get('signDate')?.value;
      return signDate ? endDate <= new Date(signDate) : false;
    };
  }
  //////////////Disable formdate when choose todate and vice versa
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
    this.inforEmployee = this.form.value
    this.form.markAllAsTouched(); 
    console.log(this.form.get('contractType')?.value)
    if(this.form.get('contractType')?.value == '2'){
      this.form.get('fromDateProbation')?.markAsTouched()
        this.form.get('toDate')?.markAsTouched()
        this.form.get('fromDateOfOffical')?.clearValidators();
    }
    
    if(this.form.get('contractType')?.value == '1'){
      this.form.get('fromDateOfOffical')?.markAsTouched()
      this.form.get('fromDateProbation')?.clearValidators();
      this.form.get('toDate')?.clearValidators();

    }

    this.form.get('contractType')?.valueChanges.subscribe((value) => {
      console.log(value)
      if (value === '1') {
        this.form.get('fromDateProbation')?.clearValidators();
        this.form.get('toDate')?.clearValidators();
        this.form.get('fromDateOfOffical')?.setValidators(Validators.required);
      } else if (value === '2') {
        this.form.get('fromDateProbation')?.setValidators(Validators.required);
        this.form.get('toDate')?.setValidators(Validators.required);
        this.form.get('fromDateOfOffical')?.clearValidators();
      }
      this.form.get('fromDateProbation')?.updateValueAndValidity();
      this.form.get('toDate')?.updateValueAndValidity();
      this.form.get('fromDateOfOffical')?.updateValueAndValidity();
    });
      
    //////////////////DRIVER//////////////////////////////
    //if have driver when u choose deparment
    if (this.hasDriver == true) {
      this.form.get('routeId')?.setValidators(Validators.required)
      this.form.get('businessCardNumber')?.setValidators(Validators.required)
      this.form.get('bcEndDate')?.setValidators(Validators.required)
      this.form.get('bcStartDate')?.setValidators(Validators.required)
      this.form.get('bcImage')?.setValidators(Validators.required)
      this.form.get('healthCertificate')?.setValidators(Validators.required)
      this.form.get('driverLicenseNumber')?.setValidators(Validators.required)
      this.form.get('driverLicenseType')?.setValidators(Validators.required)
      this.form.get('dlStartDate')?.setValidators(Validators.required)
      this.form.get('dlEndDate')?.setValidators(Validators.required)
      this.form.get('dlImage')?.setValidators(Validators.required)
      this.form.get('hcEndDate')?.setValidators(Validators.required)
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
    this.form.get('fromDateProbation')?.updateValueAndValidity()
    this.form.get('fromDateOfOffical')?.updateValueAndValidity()
    this.form.get('toDate')?.updateValueAndValidity()

    this.form.get('hasChild')?.markAsTouched()
    // if(this.lstArchivedRecords.value){
    //   this.lstArchivedRecords.controls.forEach((value: any) => {
    //     value.get('name')?.markAsTouched();
    //     value.get('code')?.markAsTouched();
    //     value.get('type')?.markAsTouched();
    //     value.get('file')?.markAsTouched();
    //   })
    // }
    console.log(this.has_child)
    if(this.form.get('hasChild')?.value  === '1'){
      this.lstChildren.controls.forEach((value: any) => {
        value.get('name')?.setValidators(Validators.required);
        value.get('gender')?.setValidators(Validators.required);
        value.get('yearOfBirth')?.setValidators(Validators.required);
      })
    }else{
      this.lstChildren.controls.forEach((value: any) => {
        value.get('name')?.clearValidators();
        value.get('gender')?.clearValidators();
        value.get('yearOfBirth')?.clearValidators();
      } )
    }

    this.lstChildren.controls.forEach((value: any) => {
      value.get('name')?.updateValueAndValidity();
      value.get('gender')?.updateValueAndValidity();
      value.get('yearOfBirth')?.updateValueAndValidity();
    } )

    if(this.lstcontractDTO.length > 0){
      this.lstcontractDTO.controls.forEach((value: any) => {
        value.get('signDate')?.markAsTouched();
        value.get('endDate')?.markAsTouched();
        value.get('file')?.markAsTouched();
      })
    }
    
    this.lstArchivedRecords.controls.forEach((value: any) => {
      value.get('name')?.markAsTouched();
      value.get('code')?.markAsTouched();
      value.get('type')?.markAsTouched();
      value.get('file')?.markAsTouched();
    })

    console.log(this.lstArchivedRecords.controls.length)

    if(this.lstArchivedRecords.controls.length === 1){
      this.lstArchivedRecords.controls.forEach((value: any) => {
        value.get('name')?.clearValidators();
        value.get('code')?.clearValidators();
        value.get('type')?.clearValidators();
        value.get('file')?.clearValidators();
      })
    }
    
    if(this.lstArchivedRecords.controls.length > 1){
      this.lstArchivedRecords.controls.forEach((value: any) => {
        value.get('name')?.setValidators(Validators.required);
        value.get('code')?.setValidators(Validators.required);
        value.get('type')?.setValidators(Validators.required);
        value.get('file')?.setValidators(Validators.required);
      })
    }

    this.lstArchivedRecords.controls.forEach((value: any) => {
      value.get('name')?.updateValueAndValidity();
      value.get('code')?.updateValueAndValidity();
      value.get('type')?.updateValueAndValidity();
      value.get('file')?.updateValueAndValidity();
    })



    const dataForm = {
      ...this.form.value,
    };
    delete dataForm.contractFile
    delete dataForm.healthCertificate

    /////////////////////// show data in to modal employee
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

    if(this.form.invalid){
      this.isModalInforEmployee == false
      // this.form.markAllAsTouched();
    }else{
      this.isModalInforEmployee == true
    }

    //log lỗi validator để check
    if (this.form.valid) {
      this.getCode()
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

  //check validators of fromdate and to date when choose contractType
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
//////////////////////////////////////////////////////////EXPORT PDF NAME///////////////////////////////////////////////////////////////////
nameOfPDF(): string {
  const now = new Date()
  const date = now.toLocaleDateString('vi-VN', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/\//g, '_');
  return `Thongtinnhanvien-${date}`
}

  //////////////////////////////////////////////////////Button save data when enough infor save///////////////////////////////////////
  saveDataEmployee(field : string) {

    console.log(this.form.value.lstcontractDTO)

    if(this.contract_type == 1){
      this.fromDateOfOffical = this.form.value.fromDateOfOffical
    }
    if(this.contract_type == 2){
      this.fromDateProbation = this.form.value.fromDateProbation
    }
    const dataForm = {
      ...this.form.value,
      code: this.codeEmployee,
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
        endDate: contract.endDate,
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


  if(field === 'saveData'){
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
  }else{
    if(this.form.valid){
      this.userSevice.exportPDF(dataForm).subscribe((response : any )=>{
        {
          const base64 = response.data
          console.log(base64)
          const blob = PDF.base64ToBlob(base64, 'application/pdf')
          // const blob = this.base64ToBlob(base64, 'application/pdf')
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${this.nameOfPDF()}.pdf`
          a.click();
          this.notification.success('Xuất file thành công!')
          // Dọn dẹp bộ nhớ
          window.URL.revokeObjectURL(url);
        }
      })
     }else{
            this.notification.error('Có lỗi xảy ra')
            this.listAR = []
     }
  }

    
  }

  /////////////////////////////////////////////////////CHANGE BLOB BEFORE EXPORT PDF//////////////////////////////////////////////////////////////////////////
  // base64ToBlob(base64: string, contentType: string = ''):Blob{
  //   try{
  //     if (base64.startsWith('data:')) {
  //       base64 = base64.split(',')[1];
  //     }
  //     const changeBlob = atob(base64)
  //     const size = new Array(changeBlob.length).fill(0).map((_, i) => changeBlob.charCodeAt(i))
  //     const byteArray = new Uint8Array(size)
  //     return new Blob([byteArray], {type: contentType})
  //   }catch(err){
  //     throw new Error('Chuỗi Base64 không hợp lệ.');
  //   }
  // }
}

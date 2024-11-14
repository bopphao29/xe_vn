import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { IData } from '../../../models/setup-profile-car/models-employee/setup-profile-employee/index.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserServiceService } from '../../../shared/services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';

interface FileCompressed {
  contractFile: File[];
  healthCertificate: File[];
  file: File[];
}

@Component({
  selector: 'app-detail-profile-employee',
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
  templateUrl: './detail-profile-employee.component.html',
  styleUrl: './detail-profile-employee.component.scss'
})
export class DetailProfileEmployeeComponent implements OnInit {

  date = null;
  isEnglish = false;
  fileList: NzUploadFile[] = [];
  fileCompressed: FileCompressed = {
    contractFile: [],
    healthCertificate: [],
    file: []
  };
  form: FormGroup;
  formEndWork!: FormGroup

  driverLicense: any[] = [];

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
    contract:[ {
      id: null,
      type: null,
      signDate: null,
      file: null
    }]
  }

  file = true
  isShowModalUploadfile = false
  isModalInforEmployee = false
  
  loading = false;
  avatarUrl?: string;
  inforEmployee: any = {}
  monthValue : string | undefined

  showStopEmployee(){
    this.isModalInforEmployee = true
  }

  userId: number = 2
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private userSevice: UserServiceService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute

  ) {
    this.form = this.fb.group(this.data)
  }

  ngOnInit(): void {
    //khởi tạo form ban đầu
    this.form = this.fb.group({
      name: [null, Validators.required],
      yearOfBirth: [null, Validators.required],
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
      contractType: [1, Validators.required],
      fromDateOfOffical: [null, Validators.required],
      fromDateProbation: [null, Validators.required],
      // fromDate: [null, Validators.required],
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
      hasChild: [0, Validators.required],
      bcImage: [[], Validators.required],
      healthCertificate: [[], Validators.required],
      dlImage: [[], Validators.required],
      // archivedRecordFiles: [],
      lstChildren: this.fb.array([]),
      lstArchivedRecords: this.fb.array([]),
      contract: this.fb.group({
        id: '',
        type: [null, Validators.required],
        signDate: [null, Validators.required]
      })
    })
    this.route.params.subscribe((params: any)=> {
      const id = params['id']
      this.monthValue = (new Date().getMonth() + 1).toString()
      console.log(id)
      this.getAchievementsStaffDetails(id)


    })
    this.checkChild()
    this.checkWork()
    this.getBranch()
    this.getOffice()
    this.getPossition()
    this.getRoute() 
    this.getDriverLicense()

    this.form.disable();

    this.formEndWork = this.fb.group({
      fromDate : null
    })
    const lstChildrenArray = this.form.get('lstChildren') as FormArray;
    lstChildrenArray.controls.forEach(control => control.disable());
  }

  isFixEmployeeButton : boolean = false
  listBranch: any[] = []
  listPosstion: any[] = []
  listOffice: any[] = []
  listDepartment: any[] = []
  listRoute: any[] = []
  listAchievementsStaffDetails : any[] = []
  lstPraises : any[] = []
  lstAchievements : any[] = []
  contract_type: number = 1
  lstPunishments : any[] = []
  has_child : number = 0
  showInforEmployee: { [key: string]: any } =  {}


  getUser(id: any) {
    this.userSevice.getDetailEmployee(id).subscribe((response: any) => {
      this.office_id = response.data.officeId
      this.showInforEmployee = response.data
      console.log(response )
      //thanhf tich
      if(response.data.lstAchievements.length > 0){
        this.lstAchievements = response.data.lstAchievements
      }
      //khen thuong

      if(response.data.lstAchievements.length > 0){
      this.lstPraises = response.data.lstPraises
      }

      if(response.data.lstAchievements.length > 0){
        this.lstPunishments = response.data.lstPunishments
        }
      //ki luat

      console.log(this.lstAchievements)
      console.log(this.lstPraises)
      console.log(this.lstPunishments)

      if(this.office_id){
        this.userSevice.getDepartment(this.office_id).subscribe((response: any) => {
        this.listDepartment = response.data
        this.listDepartment.forEach((value: any)=> {
          const isDriver = this.listDepartment.find(item => item.id = this.office_id)
          const codeDriver = isDriver.code
          console.log(codeDriver)
          if(codeDriver == 'DRIVER' && codeDriver != null){
            this.hasDriver = true
          }else{
            this.hasDriver = false
          }
        })
      })}

      Object.keys(response.data).forEach(key => {
        console.log(`${key}:`, response.data[key]);
      });
      // this.form.patchValue(response.data)
      if(response.data.name != null){
        this.form.get('name')?.setValue(response.data.name.toString())
      }
      if(response.data.yearOfBirth != null){
      this.form.get('yearOfBirth')?.setValue(response.data.yearOfBirth.toString())

      }
      if(response.data.gender != null){
        this.form.get('gender')?.setValue(response.data.gender.toString())
      }
      if(response.data.identifierId != null){
        this.form.get('identifierId')?.setValue(response.data.identifierId.toString())
      }
      if(response.data.name != null){
        this.form.get('name')?.setValue(response.data.name.toString())
      }
      if(response.data.zalo != null){
      this.form.get('zalo')?.setValue(response.data.zalo.toString())

      }
      if(response.data.email != null){
        this.form.get('email')?.setValue(response.data.email.toString())
      }
      if(response.data.ethnicGroup != null){
        this.form.get('ethnicGroup')?.setValue(response.data.ethnicGroup.toString())
      }
      if(response.data.religion != null){
        this.form.get('religion')?.setValue(response.data.religion.toString())
      }
      if(response.data.professionalLevel != null){
        this.form.get('professionalLevel')?.setValue(response.data.professionalLevel.toString())
      }
      if(response.data.maritalStatus != null){
        this.form.get('maritalStatus')?.setValue(response.data.maritalStatus.toString())
      }
      if(response.data.contactPerson != null){
        this.form.get('contactPerson')?.setValue(response.data.contactPerson.toString())
      }
      if(response.data.contactPersonPhone != null){
        this.form.get('contactPersonPhone')?.setValue(response.data.contactPersonPhone.toString())
      }
      if(response.data.staffRelation != null){
        this.form.get('staffRelation')?.setValue(response.data.staffRelation.toString())
      }
      if(response.data.permanentAddress != null){
        this.form.get('permanentAddress')?.setValue(response.data.permanentAddress.toString())
      }
      if(response.data.temporaryAddress != null){
        this.form.get('temporaryAddress')?.setValue(response.data.temporaryAddress.toString())
      }
      if(response.data.contractType != null){
        this.form.get('contractType')?.setValue(response.data.contractType)
      }
      if(response.data.hasChild != null){
        this.form.get('hasChild')?.setValue(response.data.hasChild)
      }
      if(response.data.fromDate != null){
        if(response.data.toDate != null){
          this.form.get('fromDateOfOffical')?.setValue(response.data.fromDate.toString())
        }
          else{
          this.form.get('fromDateProbation')?.setValue(response.data.fromDate.toString())

        }
      }
      if(response.data.toDate != null){
        this.form.get('toDate')?.setValue(response.data.toDate.toString())
      }

      if(response.data.officeId != null){
        this.form.get('officeId')?.setValue(response.data.officeId)
      }
      if(response.data.departmentId != null){
        this.form.get('departmentId')?.setValue(response.data.departmentId)
      }
      if(response.data.branchId != null){
        this.form.get('branchId')?.setValue(response.data.branchId)
      }
      if(response.data.positionId != null){
        this.form.get('positionId')?.setValue(response.data.positionId)
      }

      if(response.data.departmentId.toString() && response.data.departmentName.toString() == 'Lái xe'){

        this.hasDriver == true
      }

      if(response.data.routeId != null){
        this.form.get('routeId')?.setValue(response.data.routeId)
      }
      if(response.data.businessCardNumber != null){
        this.form.get('businessCardNumber')?.setValue(response.data.businessCardNumber)
      }
      if(response.data.bcStartDate != null){
        this.form.get('bcStartDate')?.setValue(response.data.bcStartDate.toString())
      }
      if(response.data.bcEndDate != null){
        this.form.get('bcEndDate')?.setValue(response.data.bcEndDate.toString())
      }
      ///////////////////////file///////////////////////////
      if(response.data.bcImage != null){
        this.form.get('bcImage')?.setValue(response.data.bcImage)
      }
      if(response.data.healthCertificate != null){
        this.form.get('healthCertificate')?.setValue(response.data.healthCertificate)

      }

      if( response.data.contract != null){
        const contractT = {
          id: response.data.contract.id,
          signDate: response.data.contract.signDate,
          type: response.data.contract.type,
        }
        this.form.get('contract')?.setValue(contractT)
        this.form.get('contractFile')?.setValue(response.data.contract.file)
      }

      if(response.data.hcEndDate != null){
        this.form.get('hcEndDate')?.setValue(response.data.hcEndDate.toString())
      }
      ///////////////////////file///////////////////////////
      if(response.data.driverLicenseNumber != null){
        this.form.get('driverLicenseNumber')?.setValue(response.data.driverLicenseNumber)
      }

      if(response.data.phoneNumber != null){
        this.form.get('phoneNumber')?.setValue(response.data.phoneNumber.toString())
      }
      if(response.data.driverLicenseType != null){
        this.form.get('driverLicenseType')?.setValue(response.data.driverLicenseType)

      }
      if(response.data.dlStartDate != null){
        this.form.get('dlStartDate')?.setValue(response.data.dlStartDate.toString())
      }
      if(response.data.dlEndDate != null){
        this.form.get('dlEndDate')?.setValue(response.data.dlEndDate.toString())
      }
      if(response.data.dlImage != null){
        this.form.get('dlImage')?.setValue(response.data.dlImage.toString())
      }

      const arr = this.form.get('lstArchivedRecords') as FormArray;
      if(response.data.lstArchivedRecords &&  response.data.lstArchivedRecords.length > 0 &&  (response.data.lstArchivedRecords[0].code !== '' || null) && (response.data.lstArchivedRecords[0].name !== '' || null) && (response.data.lstArchivedRecords[0].file !== '') && (response.data.lstArchivedRecords[0].type !== '' || null)){
        response.data.lstArchivedRecords.map((ele: any) => {
          // console.log(ele)
          arr.push(this.fb.group({
            code: ele.code,
              name: ele.name,
              type: ele.type,
              file: ele.file 
          }))
        })
      }
      

      const arrCh = this.form.get('lstChildren') as FormArray;
      if(response.data.lstChildren && response.data.lstChildren.length > 0 && (response.data.lstChildren[0].yearOfBirth !== '' || null) && (response.data.lstChildren[0].name !== '' || null) && (response.data.lstChildren[0].gender !== '' || [])){
        response.data.lstChildren.map((ele: any)=>{
          arrCh.push(this.fb.group({
            name: ele.name,
            yearOfBirth: ele.yearOfBirth,
            gender: ele.gender.toString()   
          }))
        }) 
      }
      
      this.form.disable();
    })
  }

  editEmployee(){
    this.form.enable()
    this.isFixEmployeeButton = true
  }

  cancelFix(){
    // this.isModalInforEmployee = false
    this.isFixEmployeeButton = false

    this.form.disable()
  }

  showEmpolyeeNoDataofLstPraises(){
    const numberData = 5
    const data = {praiseDate: null, description: null}
 
    const dataRows = this.lstPraises.slice()
    const currentData = dataRows.length
    if(currentData < numberData){
      const databefore = numberData - currentData
      for(let i = 0;i < databefore; i++){
        dataRows.push(data)
      }
    }

    return dataRows
  }

  showEmpolyeeNoDataofLstAchievements(){
    const numberData = 5
    // const data = {data: null}
 
    const dataRows = this.lstAchievements.slice()
    const currentData = dataRows.length
    if(currentData < numberData){
      const databefore = numberData - currentData
      for(let i = 0;i < databefore; i++){
        dataRows.push(null)
      }
    }

    return dataRows
  }

  showEmpolyeeNoDataofLstPunishments(){
    const numberData = 5
    const data = {violationDate: null, content: null}
 
    const dataRows = this.lstPunishments.slice()
    const currentData = dataRows.length
    if(currentData < numberData){
      const databefore = numberData - currentData
      for(let i = 0;i < databefore; i++){
        dataRows.push(data)
      }
    }

    return dataRows
  }

  getDriverLicense(){
    this.userSevice.getDriverLicense().subscribe((response: any)=>{
      this.driverLicense = response.data
    })
  }

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

    this.getDepartment()

  }

  getDepartment() {
    console.log(this.office_id)
    const idOffice :number =0
    this.form.get('officeId')?.valueChanges.subscribe((value: any)=> {
     idOffice == value
    })
    if(this.office_id){
      this.userSevice.getDepartment(this.office_id).subscribe((response: any) => {
      this.listDepartment = response.data
      console.log(this.listDepartment)
    })}

    this.checkDriver()
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
      name: [''],
      code: [''],
      type: [''],
      file: ['']
    });
  }

  createContract(record: { id: string | null; type: string | null; signDate: string | null }): FormGroup {
    return this.fb.group({
      id: [''],
      type: [''],
      date: [''],
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

  //modal
  showModalInforEmployee() {
    // this.isModalInforEmployee = true
    this.inforEmployee = this.form.value
    // this.loading = true
    // this.saveDataEmployee()
  }

  // lấy giá trị trong các trường
  handleCancel() {
    this.isModalInforEmployee = false
  }

  handleSubmit(): void {
    this.isModalInforEmployee = false;
  }

  office_id :number = 0
  //check driver => show input
  idDriver: number = -10
  hasDriver : boolean = false
  deparmentCode = '' 
  checkDriver() {
    console.log(this.office_id)
    if(this.office_id != 0 ){
      this.form.get('departmentId')?.valueChanges.subscribe((value: any) => {
        console.log(value)
        this.idDriver = value // 1
        const isDriver = this.listDepartment.find(item => item.id === this.idDriver)
        console.log(isDriver)
        var codeDriver: any = isDriver.name
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
  }


  hasChildren: number = -10

  checkChild() {
    this.form.get('hasChild')?.valueChanges.subscribe((value: any) => {
      this.hasChildren = value
      console.log(this.hasChildren)

    })
  }

  checkContractType: number = 0
  checkWork(){
    this.form.get('contractType')?.valueChanges.subscribe((value: any)=> {
      this.checkContractType = value
    })
  }



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

  maxYearChild: number = 0
  minYearChild: number = 0
  maxYear: number = 0
  minYear: number = 0

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

  fieldName: string = '';
  openFileModal(field: string): void {// file này để lưu tên trường , để tật modal theo file tên gì
    this.fieldName = field; // Lưu tên trường
    this.isShowModalUploadfile = true;

    // Điều khiển hiển thị các input
    if (field === 'bcImage') {
      this.isBcImageVisible = true;
      this.isDlImageVisible = false;
      this.isShowModalUploadfile = true
    } else {
      this.isBcImageVisible = false;
      this.isDlImageVisible = true;
      this.isShowModalUploadfile = true
    }
    // vì cùng 1 modal nên nên khi bật nên phải khởi tạo khởi tạo lại các giá trị
    this.selectedFile = null;// 
    this.previewUrl = null;//
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


  handleChangeFile(event: any, field: 'bcImage' | 'dlImage'): void {//
    const file = event.file.originFileObj;// tạo biến chứa file gốc đã chọn
    if (file) { // nếu có file
      const reader = new FileReader();// đọc file
      reader.onload = (e: any) => {// sau khi đọc xong
        this.imageUrl = e.target.result; // gán url vào imageUrl
      };
      reader.readAsDataURL(file);// dọc file => chuyển file sang chuỗi base 64

      this.form.get(field)?.setValue(file.name); // lấy formControl của field và set vào file.name

      // Cập nhật mảng file trong fileCompressed
      if (field === 'bcImage') { // nếu field =bcImage bcImage
        this.fileCompressed.contractFile = [file];//contractFile cập nhật
        this.bcImageName = file.name;
      } else if (field === 'dlImage') {
        this.fileCompressed.healthCertificate = [file];
        this.dlImageName = file.name;
      }

    }


    // const imageType = event.file.name.includes("") ? 'bcImage' : 'dlImage'; // Phân loại dựa trên tên file
    // this.imgList[imageType] = [file]; //
    // this.form.get(imageType)?.setValue(file.name);
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

  imgList: { [key: string]: File[] } = { bcImage: [], dlImage: [] };// biến để lưu chữ giá trị file
  imagePreviews: { [key: string]: string | null } = { bcImage: null, dlImage: null };// tương tự , đây là biến lưu url
  currentImageType: string = ''; // tạo biến luu ảnh tạm thòi

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

  // Hàm xử lý thay đổi ngày
  onDateChange(date: Date): void {
    if (date instanceof Date) {
      this.isoDate = date.toISOString(); // Chuyển đổi sang ISO 8601
      console.log(this.isoDate)
    } else {
      this.isoDate = null;
    }
  }

  onBack(){
    this.router.navigate(['employee/employee-management'])
  }

  officeEmployee : any
  officeName: any
  branchEmployee : any
  branchName: any
  positionEmloyee: any
  positionName: any
  deparmentEmployee:any
  deparmentName: any
  routeEmployee: any
  routeName: any


  idEmployee = 0
  
  fromDateOffical :any
  fromDateProbation : any

  ///////////////////////////////////////////////////////save data////////////////////////////////////////////
  saveDataEmployee() {
    this.route.params.subscribe((params: any)=> {
      this.idEmployee= params['id']
    })

    if(this.contract_type == 1){
      this.fromDateOffical = this.form.value.fromDateOfOffical
    }
    if(this.contract_type == 2){
      this.fromDateProbation = this.form.value.fromDateProbation
      
    }
    console.log(this.fromDateProbation )
    console.log(this.fromDateOffical )

    const dataForm = {
      id: this.idEmployee,
      fromDate : this.contract_type == 1 ? this.fromDateOffical :this.fromDateProbation,
      ...this.form.value,
      lstArchivedRecords: this.form.value.lstArchivedRecords.map((record: any) => ({// trong form Array
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
    delete dataForm.contractFile
    delete dataForm.bcImage
    delete dataForm.healthCertificate
    delete dataForm.dlImage
    delete dataForm.fromDateOfOffical
    delete dataForm.fromDateProbation

    //office => đã có id => timf tên theo id
    // this.officeEmployee = dataForm.officeId
    // const officeIndex = this.listOffice.find(item => item.id === this.officeEmployee)
    // if(dataForm.officeId){
    //   this.officeName = officeIndex.name 
    // }
    // //deparment
    // this.deparmentEmployee = dataForm.departmentId
    // const deparmentIndex = this.listDepartment.find(item => item.id === this.deparmentEmployee)
    // if(dataForm.departmentId){
    //   this.deparmentName = deparmentIndex.name 
    // }
    // //branch
    // this.branchEmployee = dataForm.branchId
    // const branchIndex = this.listBranch.find(item => item.id === this.branchEmployee)
    // if(dataForm.branchId){
    // this.branchName = branchIndex.name 
    // }
    // //position
    // this.positionEmloyee = dataForm.positionId
    // console.log(this.positionEmloyee)
    // const positionIndex = this.listPosstion.find(item => item.id === this.positionEmloyee)
    // if(dataForm.positionId){
    //   this.positionName = positionIndex.name
    // }
    // //route
    // this.routeEmployee =dataForm.routeId
    // const routeIndex = this.listRoute.find(item => item.id === this.routeEmployee)
    // if(dataForm.routeId){
    //   this.routeName = routeIndex.name 
    // }

    const formData = new FormData();

    formData.append('data', JSON.stringify(dataForm));
    if (this.fileCompressed.healthCertificate.length > 0) {
      formData.append('healthCertificate', this.fileCompressed.healthCertificate[0]);
    }

    if (this.fileCompressed.contractFile.length > 0) {
      formData.append('contractFile', this.fileCompressed.contractFile[0]);
    }

    // archivedRecordFile.forEach((value: any) => {
    //   formData.append('archivedRecordFiles', value)
    // })

    console.log(this.fileCompressed.file)
    //  formData.append('data', JSON.stringify(dataForm))

    if (this.dlImage[0]) {
      formData.append('dlImage', this.dlImage[0]);
    }
    if (this.bcImgFile[0]) {
      formData.append('bcImage', this.bcImgFile[0]);
    }
    //  formData.append('healthCertificate', this.fileCompressed.healthCertificate[0]);
    //  formData.append('contractFile', this.fileCompressed.contractFile[0] );
    //  formData.append('archivedRecordFiles', archivedRecordFile)    



    // console.log(formData)

    this.userSevice.updateEmployee(formData).subscribe({
      next: (response) => {
        this.notification.success('Chỉnh sửa hồ sơ nhân viên thành công!')
        this.isFixEmployeeButton = false  
        // this.form.reset()
        // this.getUser(this.idEmployee)
      },
      error: (error) => {
        // if(error.status === 400){
        //   this.notification.error(error.message)
        // }

      }
    })
  }

  updateWorkStatus(){
    this.formEndWork.markAllAsTouched()
    const dataFormEndWork ={
      staffId : this.showInforEmployee['id'],
      toDate: '',
      ...this.formEndWork.value,
      type : 0
    }
    console.log(dataFormEndWork)

    this.userSevice.updateStatusWork(dataFormEndWork).subscribe({
      next: (response) => {
        this.notification.success('Xác nhận thôi việc thành công')
        this.isModalInforEmployee = false  
        // this.form.reset()
        // this.getUser(this.idEmployee)
      },
      error: (error) => {
        // if(error.status === 400){
        //   this.notification.error(error.message)
        // }

      }
    })
  }



  ///////////////////////////////////////////////////// Modal Achievements///////////////////////////////////////////////////
  isModalAchievements: boolean = false
  yearNow = new Date().getFullYear();
  optionMonth = [
    {id : '1', value: 'January'},
    {id : '2', value: 'February'},
    {id : '3', value: 'March'},
    {id : '4', value: 'April'},
    {id : '5', value: 'May'},
    {id : '6', value: 'June'},
    {id : '7', value: 'July'},
    {id : '8', value: 'August'},
    {id : '9', value: 'September'},
    {id : '10', value: 'October'},
    {id : '11', value: 'November'},
    {id : '12', value: 'December'},
  ]

  tagPlaceholder: any = () => `...`;
  listArchiOfStaff : any = []

  onChangeMonth(month: string){
    this.route.params.subscribe((params: any)=> {
      const id = params['id']

      this.getAchievementsStaffDetails(id)
    })
  }

  listArchiOfStaffNew : [string, number][] = []


  getAchievementsStaffDetails(id: any){
    const month = this.monthValue || (new Date().getMonth() + 1).toString()
    this.userSevice.getAchievementsStaffDetails(id, month, this.yearNow).subscribe((response : any)=>{
        this.listArchiOfStaff = Object.entries(response.data.achievements)
        this.listArchiOfStaffNew = [...this.listArchiOfStaff]

    })
  }

  changeDataOfTable(dayIndex : number){
    console.log( Object.entries(this.listArchiOfStaff))
    if(this.listArchiOfStaffNew[dayIndex]){
      const [key, value] = this.listArchiOfStaffNew[dayIndex]

      this.listArchiOfStaff[dayIndex][1] = this.listArchiOfStaffNew[dayIndex][1] === 0 ? 1 : 0
      this.listArchiOfStaff[key] = this.listArchiOfStaffNew[dayIndex][1] 
    }
  }

  handleCancelAchive(){
    this.isModalAchievements = false
  }

  handleSubmitAchive(){
    this.isModalAchievements = false
  }




}

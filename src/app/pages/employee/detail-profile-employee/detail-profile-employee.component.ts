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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray, Validators,AbstractControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer, firstValueFrom  } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserServiceService } from '../../../shared/services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { MatTooltipModule } from '@angular/material/tooltip';

// import { MinioService } from '../../../shared/services/minio.service';

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
    NzPaginationModule,
    MatTooltipModule

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
  has_child : any

  driverLicense: any[] = [];

  data: IData = {
    name: null,
    yearOfBirth: null,
    gender: null,
    identifierId: null,
    phoneNumber: null,
    zalo: null,
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
      endDate: null,
      signDate: null,
      file: null
    }]
  }

  listDuration = [
    {id: 1, value:"Hợp đồng 1 năm"},
    {id: 2, value:"Hợp đồng 3 năm"},
    {id: 3, value:"Hợp đồng vô thời hạn"}
  ]

  file = true
  isShowModalUploadfile = false
  isModalInforEmployee = false
  
  loading = false;
  avatarUrl?: string;
  inforEmployee: any = {}
  monthValue : string | undefined
  originalData: any

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
    private route: ActivatedRoute,
    // private minitoService : MinioService

  ) {
    this.form = this.fb.group(this.data)
  }

  ngOnInit(): void {
    //khởi tạo form ban đầu
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
      hasChild: ['0', Validators.required],
      bcImage: [[], Validators.required],
      healthCertificate: [[], Validators.required],
      dlImage: [[], Validators.required],
      // archivedRecordFiles: [],
      lstChildren: this.fb.array([]),
      lstArchivedRecords: this.fb.array([]),
      contract: this.fb.array([])

    })
    this.route.params.subscribe((params: any)=> {
      const id = params['id']
      this.monthValue = (new Date().getMonth() + 1).toString()
      console.log(id)
      this.getUser(id)
      this.getAchievementsStaffDetails(id)


    })
    this.checkChild()
    this.checkWork()
    this.getBranch()
    this.getOffice()
    this.getPossition()
    this.getRoute() 
    this.getDriverLicense()
    this.trackFormChanges();
    
    this.getAchievement()
    this.getPunishments()
    this.getPraises()
    this.updateDaysInMonth()
    this.form.disable();

    this.formEndWork = this.fb.group({
      fromDate : [null, Validators.required],
      reason: [null,  Validators.required]
    })
    const lstChildrenArray = this.form.get('lstChildren') as FormArray;
    lstChildrenArray.controls.forEach(control => control.disable());

    this.form.get('contractType')?.valueChanges.subscribe((value: any) => {
      if(value === '1' || value === 1){
        this.contract_type = 1
      }else{
        this.contract_type = 2
      }
      
    })
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
  showInforEmployee: { [key: string]: any } =  {}

  listGender = [
    {id: 1, value: "Nam"},
    {id: 2, value: "Nữ"}
  ]

  listMarialStatus = [
    {id: 1, value: "Chưa kết hôn"},
    {id: 2, value: "Đã kết hôn"}
  ]

  getUser(id: any) {
    this.userSevice.getDetailEmployee(id).subscribe((response: any) => {
      this.office_id = response.data.officeId
      this.showInforEmployee = response.data
      //thanhf tich
      if(response.data?.lstAchievements){
        this.lstAchievements = response.data.lstAchievements
      }
      //khen thuong

      if(response.data?.lstPraises){
      this.lstPraises = response.data.lstPraises
      }

      if(response.data?.lstPunishments){
        this.lstPunishments = response.data.lstPunishments
        }
      //ki luat

      if(this.office_id){
        this.userSevice.getDepartment(this.office_id).subscribe((response: any) => {
        this.listDepartment = response.data
      })}

      // Object.keys(response.data).forEach(key => {
      //   console.log(`${key}:`, response.data[key]);
      // });
      if(response.data.name != null){
        this.form.get('name')?.setValue(response.data.name.toString())
      }
      if(response.data.yearOfBirth != null){
      this.form.get('yearOfBirth')?.setValue(response.data.yearOfBirth.toString())
      }
      console.log(response.data.gender)
      if(response.data.gender != null){
        this.form.get('gender')?.setValue(response.data.gender)
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
        this.form.get('maritalStatus')?.setValue(response.data.maritalStatus)
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
        this.form.get('contractType')?.setValue(response.data.contractType.toString())
      }
      if(response.data.hasChild != null){
        this.form.get('hasChild')?.setValue(response.data.hasChild.toString())
      }
      if(response.data.fromDate != null){
        if(response.data.toDate != null){
          this.form.get('fromDateProbation')?.setValue(response.data.fromDate.toString())
        }
          else{
          this.form.get('fromDateOfOffical')?.setValue(response.data.fromDate.toString())
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

      console.log(response.data.departmentName)

      if(response.data?.departmentName == 'Lái xe'){

        this.hasDriver = true
      }else{
        this.hasDriver = false

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
      }else{
        arr.push(this.fb.group({
          code: '',
          name: '',
          type: '',
          file: ''
        }));
      }

      console.log(response.data.contract)

      
      const arrCo = this.form.get('contract') as FormArray;
      if(response.data.contract &&  response.data.contract.length > 0 && (response.data.contract[0].signDate !== '' || null) && (response.data.contract[0].file !== '') && (response.data.contract[0].type !== '' || null)){
        response.data.contract.map((ele: any) => {
          console.log(ele)
          arrCo.push(this.fb.group({
            signDate: ele.signDate,
              endDate: ele.endDate,
              file: ele.file
          }))
        })
      }else{
        arrCo.push(this.fb.group({
          signDate: '',
          type: '',
          file: '',
          id: ''
        }));
      }

      const arrCh = this.form.get('lstChildren') as FormArray;
      if(response.data.lstChildren && response.data.lstChildren.length > 0 && (response.data.lstChildren[0].yearOfBirth !== '' || null) && (response.data.lstChildren[0].name !== '' || null) && (response.data.lstChildren[0].gender !== '' || [])){
        response.data.lstChildren.map((ele: any)=>{
          arrCh.push(this.fb.group({
            name: ele.name,
            yearOfBirth: ele.yearOfBirth,
            gender: ele.gender
          }))
        }) 
      }
      else{
        arrCh.push(this.fb.group({
          name: '',
          yearOfBirth: '',
          gender: ''   
        }))
      }

      
      this.form.disable();

    })
  }


  //////////////////////////////////////////////////phân trang thành tích////////////////////////////////////////

  pageAch : number = 1
  pagePu: number = 1
  pagePr: number = 1

  size: number = 5

  isYear : any[ ] = []
  isPusnish : any[] = []
  isPrai : any[] = []


  totalAchi = 0
  totalPush = 0
  totalPrai = 0


  getAchievement(){
    
    this.route.params.subscribe((params : any)=>{
      const id = params['id']
      this.userSevice.getachievementsInDetailsEmployee(this.pageAch - 1, this.size, id).subscribe((response: any)=>{
        this.isYear = response.data.content.map((item : any) => ({item}));
        //  this.isYear = year.item
        this.totalAchi = response.data.totalElements
        console.log(this.isYear)
         
      })
    })
  }

  getPunishments(){
    
    this.route.params.subscribe((params : any)=>{
      const id = params['id']
      this.userSevice.getpunishmentsInDetailsEmployee(this.pagePu - 1, this.size, id).subscribe((response: any)=>{
        this.isPusnish = response.data.content
        this.totalPush = response.data.totalElements
        console.log(response.data)
      })
    })
  }

  isPraises : any[] = []
  getPraises(){
    
    this.route.params.subscribe((params : any)=>{
      const id = params['id']
      this.userSevice.getpraisesInDetailsEmployee(this.pagePr -1, this.size, id).subscribe((response: any)=>{
        this.isPraises = response.data.content
        this.totalPrai = response.data.totalElements
        console.log(response.data)

      })
    })
  }

  onPageChangeAchie(page: number): void {
    this.pageAch = page;
    
    this.getAchievement();
  }

  onPageChangePunishments(page: number): void {
    this.pagePu = page;
    
    this.getPunishments();
  }
  onPageChangePraises(page: number): void {
    this.pagePr = page;
    
    this.getPraises();
  }

  showEmpolyeeNoDataofLstAchievements(){
    const numberData = 5
    // const data = {data: null}
 
    const dataRows = this.isYear.slice();
    // console.log(dataRows)
    const currentData = dataRows.length
    if(currentData < numberData){
      const databefore = numberData - currentData
      for(let i = 0;i < databefore; i++){
        dataRows.push(null)
      }
    }

    return dataRows
  }
/////////////////////////////////////////////////validate just enter text input/////////////////
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




  ///////////////////////////////////////////////////////////////////////////////////////////////
  editEmployee(){
    this.form.enable()
    this.isFixEmployeeButton = true
  }

  cancelFix(){
    // this.isModalInforEmployee = false
    
    this.isFixEmployeeButton = false
    this.form.disable()
    window.location.reload()
  }

  cancelEndWork(){
    this.isModalInforEmployee = false
    this.formEndWork.reset()
  }

  showEmpolyeeNoDataofLstPraises(){
    const numberData = 5
    const data = {praiseDate: null, description: null}
 
    const dataRows = this.isPraises.slice()
    const currentData = dataRows.length
    if(currentData < numberData){
      const databefore = numberData - currentData
      for(let i = 0;i < databefore; i++){
        dataRows.push(data)
      }
    }

    return dataRows
  }

  showEmpolyeeNoDataofLstPunishments(){
    const numberData = 5
    const data = {violationDate: null, content: null}
 
    const dataRows = this.isPusnish.slice()
    const currentData = dataRows.length
    if(currentData < numberData){
      const databefore = numberData - currentData
      for(let i = 0;i < databefore; i++){
        dataRows.push(data)
      }
    }

    return dataRows
  }

  getDayMonthYear(month: number, year: number){
    return new Date(year, month, 0).getDate();
  }

  daysInMonth: number[] = [];// mảng ngày
  updateDaysInMonth(): void {
    const monthValue: number = new Date().getMonth() + 1;
    const totalDays = this.getDayMonthYear(monthValue, this.newYear);
    this.daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1); // Tạo danh sách ngày [1, 2, ..., totalDays]
  }

  newYear : number  = 0
  openModalAchievements(year: number): void {
    this.newYear = year; // Gán năm được chọn
    this.isModalAchievements = true; // Mở modal
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

    this.getDList()

  }

  getDList() {
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

    this.form.get('departmentId')?.valueChanges.subscribe((value: any) => {
      this.checkDriver()
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
      name: ['', Validators.required],
      code: ['' , Validators.required],
      type: ['' , Validators.required],
      file: ['' , Validators.required]
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

  createlstChildren(child: { name: string | null; yearOfBirth: number | null; gender: string | null }): FormGroup {
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

  removeArchivedRecord(index: number) {
    this.lstArchivedRecords.removeAt(index)
  }

  removeContract(index: number) {
    this.lstcontractDTO.removeAt(index)
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
    if(this.office_id != null ){
      this.form.get('departmentId')?.valueChanges.subscribe((value: any) => {
        const isDriver = this.listDepartment.find((item: any) => item.id === parseInt(value))
        if(isDriver){
          var codeDriver: any = isDriver.code
        this.deparmentCode = codeDriver
        if (isDriver && codeDriver == 'DRIVER') {
          this.hasDriver = true
        }
        else{
          this.hasDriver = false
        }
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
      } else{
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

  onFileChangeContract(event: any, fieldName: any, index: number): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
    const file = fileList[0];
    this.fileCompressed.contractFile[index] = file

    console.log(this.fileCompressed.contractFile[index])
    if (fieldName === 'file') {
      this.lstcontractDTO.at(index).patchValue({ file }); // cập nhật trực tiếp file
      console.log(this.lstcontractDTO.at(index).get('file')?.value?.name)
    }
  }
  }


  onFileChangeAchi(event: any, fieldName: any, index: number): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
    const file = fileList[0];
    this.fileCompressed.file[index] = file

    if (fieldName === 'file') {
      this.lstArchivedRecords.at(index).patchValue({ file: file }) // cập nhật trực tiếp file
    } 
  }
    
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

  onBack(event: Event){

    const router = localStorage.getItem('activeLink')
    if(router === 'employeeProfile'){
      event.preventDefault();
      this.router.navigate(['employee/list-employee-profile']);
    }
    if(router === 'employeeeProbation'){
      event.preventDefault();
      this.router.navigate(['employee/list-employee-probation']);

    }

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


  cleanAchive(){
    this.lstArchivedRecords.reset()
  }
  
  showButtonClean: boolean = false;
  trackFormChanges(): void {
    this.lstArchivedRecords.valueChanges.subscribe(() => {
      this.showButtonClean = this.lstArchivedRecords.controls.some(
        (control) => control.dirty || control.touched
      );
    });
  }

  ///////////////////////////////////////////////////////save data////////////////////////////////////////////
  saveDataEmployee() {
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
      
    this.form.get('branchId')?.markAsTouched()
    this.form.get('departmentId')?.markAsTouched()
    this.form.get('officeId')?.markAsTouched()
    this.form.get('positionId')?.markAsTouched()
    //////////////////DRIVER//////////////////////////////
    //if have driver when u choose deparment
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
        value.get('endDate')?.markAsTouched();
        value.get('file')?.markAsTouched();
      })
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
    
    this.route.params.subscribe((params: any)=> {
      this.idEmployee= params['id']
    })

    if(this.contract_type == 1){
      this.fromDateOffical = this.form.value.fromDateOfOffical
    }
    if(this.contract_type == 2){
      this.fromDateProbation = this.form.value.fromDateProbation
      
    }
    console.log(this.fileCompressed)
    console.log(this.form.value.lstArchivedRecords)

    const dataForm = {
      id: this.idEmployee,
      fromDate : this.contract_type == 1 ? this.fromDateOffical :this.fromDateProbation,
      ...this.form.value,
      lstArchivedRecords: this.form.value.lstArchivedRecords.length === 1 
      && this.form.value.lstArchivedRecords[0].name === '' 
      && this.form.value.lstArchivedRecords[0].code === '' 
      && this.form.value.lstArchivedRecords[0].type === '' 
      && this.form.value.lstArchivedRecords[0].file === '' 
      ? null : this.form.value.lstArchivedRecords.map((record: any) => ({// trong form Array
        name: record.name,
        code: record.code,
        type: record.type,
        file: record.file instanceof File ? record.file.name : record.file 
      })),
      contract: this.form.value.contract.map((contract : any)=>({
        id: contract.id,
        signDate: contract.signDate,
        endDate: contract.endDate,
        file: contract.file instanceof File ? contract.file.name : contract.file 
      })),
      lstChildren: ((this.form.value.lstChildren.length === 1 
      && this.form.value.lstChildren[0].name === '' 
      && this.form.value.lstChildren[0].yearOfBirth === '' 
      && this.form.value.lstChildren[0].gender === '') || this.form.get('hasChild')?.value == '0')
      ? null : this.form.value.lstChildren.map((child: any) => ({
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

    var contract_file: any = this.fileCompressed.contractFile
    console.log(this.fileCompressed.contractFile)
    
    contract_file.forEach((value: any) => {
      formData.append('contractFile', value)
    })

    var archivedRecordFile: any = this.fileCompressed.file
    console.log(this.fileCompressed)

    archivedRecordFile.forEach((value: any) => {
      formData.append('archivedRecordFiles', value)
    })

    console.log(this.fileCompressed.file)
    //  formData.append('data', JSON.stringify(dataForm))

    if (this.dlImage[0]) {
      formData.append('dlImage', this.dlImage[0]);
    }
    if (this.bcImgFile[0]) {
      formData.append('bcImage', this.bcImgFile[0]);
    }

    // console.log(formData)

    console.log(this.form.get('departmentId')?.value)
    const findDepartment = this.listDepartment.find((item: any) => {
      return item.id === Number(this.form.get('departmentId')?.value) && item.name === 'Lái xe' && item.code === 'DRIVER'
    console.log(item)
    }
      
  )
  
    if(findDepartment){
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
    }else{
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


    if(this.lstArchivedRecords.controls.length >= 2){
      this.lstArchivedRecords.controls.forEach((value: any) => {
        value.get('name')?.setValidators(Validators.required);
        value.get('code')?.setValidators(Validators.required);
        value.get('type')?.setValidators(Validators.required);
        value.get('file')?.setValidators(Validators.required);
      })
    }else{
      this.lstArchivedRecords.controls.forEach((value: any) => {
        value.get('name')?.clearValidators();
        value.get('code')?.clearValidators();
        value.get('type')?.clearValidators();
        value.get('file')?.clearValidators();
      })
    }

    this.lstArchivedRecords.controls.forEach((value: any) => {
      value.get('name')?.updateValueAndValidity();
      value.get('code')?.updateValueAndValidity();
      value.get('type')?.updateValueAndValidity();
      value.get('file')?.updateValueAndValidity();
    })




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

    if(this.form.valid){
      this.userSevice.updateEmployee(formData).subscribe({
        next: (response) => {
          this.notification.success('Chỉnh sửa hồ sơ nhân viên thành công!')
          this.isFixEmployeeButton = false  
          this.form.disable()
          
          window.location.reload()
          // this.getUser(this.idEmployee)
        },
        error: (error) => {
        }
      })
    }else{
      this.notification.error('Có lỗi xảy ra')

    }
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

    if(this.formEndWork.valid){
      this.userSevice.updateStatusWork(dataFormEndWork).subscribe({
        next: (response) => {
          this.notification.success('Xác nhận thôi việc thành công')
          // this.isModalInforEmployee = false  
          localStorage.setItem('activeLink', 'employeeResign')
          this.router.navigate(['employee/list-employee-resign'])
          // this.getUser(this.idEmployee)
        },
        error: (error) => {
          // if(error.status === 400){
          //   this.notification.error(error.message)
          // }
  
        }
      })
    }
    else{
      this.notification.error('Hãy xét thời gian thôi việc')

    }
  }



  ///////////////////////////////////////////////////// Modal Achievements///////////////////////////////////////////////////
  isModalAchievements: boolean = false
  yearNow = new Date().getFullYear();
  optionMonth = [
    {id : '1', value: 'Tháng 1'},
    {id : '2', value: 'Tháng 2'},
    {id : '3', value: 'Tháng 3'},
    {id : '4', value: 'Tháng 4'},
    {id : '5', value: 'Tháng 5'},
    {id : '6', value: 'Tháng 6'},
    {id : '7', value: 'Tháng 7'},
    {id : '8', value: 'Tháng 8'},
    {id : '9', value: 'Tháng 9'},
    {id : '10', value: 'Tháng 10'},
    {id : '11', value: 'Tháng 11'},
    {id : '12', value: 'Tháng 12'},
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

  resultStatus =''
  getAchievementsStaffDetails(id: any){
    const month = this.monthValue || (new Date().getMonth() + 1).toString()
    this.userSevice.getAchievementsStaffDetails(id, month, this.yearNow).subscribe((response : any)=>{

        this.listArchiOfStaff = Object.entries(response.data.achievements)
        this.listArchiOfStaffNew = [...this.listArchiOfStaff]

        const daysWithTicks = this.listArchiOfStaff.filter((day: any) => day[1] === 1).length;
    const totalDays = this.listArchiOfStaff.length;

    // Tính toán kết quả đạt hay không
    const percentage = (daysWithTicks / totalDays) * 100;
    this.resultStatus = percentage >= 80 ? 'Đạt' : 'Không đạt';
    })
  }

  changeDataOfTable(dayIndex : number){
    console.log( Object.entries(this.listArchiOfStaff))
    if(this.listArchiOfStaffNew[dayIndex]){
      const [key, value] = this.listArchiOfStaffNew[dayIndex]

      this.listArchiOfStaff[dayIndex][1] = this.listArchiOfStaffNew[dayIndex][1] === 0 ? 1 : 0
      this.listArchiOfStaff[key] = this.listArchiOfStaffNew[dayIndex][1] 

      const daysWithTicks = this.listArchiOfStaff.filter((day : any) => day[1] === 1).length;
      const totalDays = this.listArchiOfStaff.length;
      const percentage = (daysWithTicks / totalDays) * 100;
      this.resultStatus = percentage >= 80 ? 'Đạt' : 'Không đạt';

      this.route.params.subscribe((params : any)=>{
        const day  = dayIndex + 1;
      const month = this.monthValue
      const year = this.yearNow
      const data = {
        day : day,
        month: month,
        year: year,
        staffId : params['id'],
        isPassed : this.listArchiOfStaff[key]
      }

      this.userSevice.changeDataOfTableachievements(data).subscribe({
        next: (response) => {
          this.notification.success('Cập nhật thành công!')

        },
        error : (err) => {
          this.notification.success('Lỗi hệ thống!')

        }
        })

      })
      
    }


  }


  handleCancelAchive(){
    this.isModalAchievements = false
  }

  handleSubmitAchive(){
    this.isModalAchievements = false
  }

/////////////////////////////////////////////////DOWN FILE USE MINIO////////////////////////////////////
fileMinio: string | null = null;

bucketName = 'xevn'; 
apiDownloadFile(fileName: string){
  this.userSevice.downloadFile(this.bucketName, fileName).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Error downloading file:', err);
    },
  });
}

downloadFileMinio(controlName: string, index: number, nameList: string): void {
  if(nameList === 'lstcontractDTO'){
    const fileName = this.lstcontractDTO.at(index).get(controlName)?.value;
    if (!fileName) {
      console.error('File name is not available');
      return;
    }else{
      this.apiDownloadFile(fileName)
    }
  }
  if(nameList === 'lstArchivedRecords'){
    const fileName = this.lstArchivedRecords.at(index).get(controlName)?.value;
    if (!fileName) {
      console.error('File name is not available');
      return;
    }else{
      this.apiDownloadFile(fileName)
    }
  }
}


downloadImage(fileName: string){
  if(fileName === 'bcImage'){
    const file = this.showInforEmployee?.['bcImage']
    this.apiDownloadFile(file)
  }if(fileName === 'healthCertificate'){
    const file = this.showInforEmployee?.['healthCertificate']
    this.apiDownloadFile(file)
  }if(fileName === 'dlImage'){
    const file = this.showInforEmployee?.['dlImage']
    this.apiDownloadFile(file)
  }
 
}



}

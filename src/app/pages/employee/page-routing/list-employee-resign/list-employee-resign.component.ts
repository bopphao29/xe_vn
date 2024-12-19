import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../../../../shared/services/user-service.service';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ChangeFunctionService } from '../../../../shared/services/change-function.service';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NotificationService } from '../../../../shared/services/notification.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-list-employee-resign',
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
  ],
  templateUrl: './list-employee-resign.component.html',
  styleUrl: './list-employee-resign.component.scss'
})
export class ListEmployeeResignComponent {
  constructor(
    private routes: Router,
    private fb :FormBuilder,
    private userSevice: UserServiceService,
    private notification: NotificationService,
    private changeFunctionService: ChangeFunctionService

  ){
   
  }
  form!: FormGroup
  formChangeInforLeave !: FormGroup
  formOnLeave !: FormGroup
  formLeaveType3 !: FormGroup


  ngOnInit(): void {
    const savedFormValue = localStorage.getItem('search');
    this.form = this.fb.group({
    txtSearch: [savedFormValue ? JSON.parse(savedFormValue).txtSearch : ''],
    officeId: [savedFormValue ? JSON.parse(savedFormValue).officeId : ''],
    branchId: [savedFormValue ? JSON.parse(savedFormValue).branchId : ''],
    departmentId: [savedFormValue ? JSON.parse(savedFormValue).departmentId : ''],
    positionId: [savedFormValue ? JSON.parse(savedFormValue).positionId : ''],
    leaveType: [1],
    })

    this.isLeave = false 
    this.onLeave = true
    this.getBranch()
    this.getDepartment()
    this.getOffice()
    this.getPossition()
    this.search()
    this.setupValueIntoForm()

    this.formChangeInforLeave = this.fb.group({
      fromDate: ['', Validators.required],
      reason: ['', Validators.required]

    })  
    this.form.get('leaveType')?.valueChanges.subscribe((value : any)=> {
      this.changeLeave = value
    })

    this.formLeaveType3 = this.fb.group({
      fromDate: ['', Validators.required],
      toDate : ['', Validators.required],
      reason: ['', Validators.required]
    })
  }

  listBranch: any[] = []
  listPosstion: any[] = []
  listOffice: any[] = []
  listDepartment: any[] = []
  isModalOnLeaveEmployee = false
  isLeaveType3 = false
  dataEmployee: any[] = []
  isResetEmployee: boolean = false
  isChangeEmployee : boolean = false
  isDelete: boolean = false
  isDeleteVacation: boolean = false
  changeLeave: any
  isWaitLeave :boolean = false
  onLeave : boolean = false
  isLeave: boolean = false
  workingStatusNum  : number = 0



  formOfLeave = [
    {id: 1, value: 'Chờ nghỉ việc'},
    {id: 2, value: 'Đã nghỉ việc'},
    {id: 3, value: 'Nghỉ phép'}
  ]

  getBranch() {
    this.userSevice.getBranch().subscribe((response: any) => {
      this.listBranch = response.data
    })
  }

  getPossition() {
    var idDepartment :number =0

    this.form.get('departmentId')?.valueChanges.subscribe((value: any) => {
      idDepartment = value
      if(value && value != ''){
        this.userSevice.getPossition(idDepartment).subscribe((response: any) => {
          this.listPosstion = response.data
        })
       }else{
        this.userSevice.getPossition(null).subscribe((response: any) => {
          this.listPosstion = response.data
        })
       }
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
     if(value){
      this.userSevice.getDepartment(idOffice).subscribe((response: any) => {
        this.listDepartment = response.data
      })
     }else{
      this.listDepartment = []
     }
    })
  }

  pageIndex = 1
  pageSize = 12

  pagedData : any[] = []

  onPageChange(page: number): void {
    this.pageIndex = page;
    // this.getListEmployee(this.pageIndex, this.pageSize,this.form.value);
    this.search()

  }

  
  routerDetailEmployee(id: any){
    this.routes.navigate(['detail-employee/', id])
  }

  total = 1

  isoDate: string | null = null;
  onDateChange(name: string | (string | number)[], date: Date): void {
    this.changeFunctionService.onDateChange(this.formChangeInforLeave, name, date)
  }

  disableIntoToDate = (toDate: Date): boolean => {
    const fromDateProbation = this.form.get('fromDateProbation')?.value
    return fromDateProbation ? toDate <= fromDateProbation : false
  }

  disableFromDate = (fromDateProbation: Date): boolean => {
    const toDate = this.form.get('toDate')?.value
    return toDate ? fromDateProbation >= toDate :false
  }

  getListEmployee(  data: any){
    this.userSevice.searchEmployee(data ).subscribe((response: any)=>{
      this.dataEmployee = response.data.content
      this.total = response.data.totalElements
      if(response.data.totalElements == 0){
        Swal.fire({
          icon: "warning",
          // title: "......",
          text: "Không tìm thấy dữ liệu bạn muốn tìm kiếm!",
          // timer: 3000
        });
      }
    })
    
  }

////////////////////////////////////////////////////////////////////
  handleCancel() {
    this.isModalOnLeaveEmployee = false
    this.formChangeInforLeave.reset()
    
  }

  handleCancelDeleteVacation(){
  this.isDeleteVacation = false

  }

  handleCancelLeaveType3() {
    this.isLeaveType3 = false
    this.formChangeInforLeave.reset()
    
  }
  

  handleSubmitLeaveType3(): void {
    this.isLeaveType3 = false;
  }

  handleSubmit(): void {
    this.isModalOnLeaveEmployee = false;
  }

  handleCancelReset(){
    this.isResetEmployee = false
  }

  handleSubmitResest(){
    
  }
/////////////////////////////////////////DELETE /////////////////////////////////
handleCancelDelete(){
  this.isDelete = false
  const dataDelete ={
    staffId : this.selectedEmployee['id'],
    type : 1,
    fromDate: null,
    toDate: null,
  }

  this.userSevice.updateStatusWork(dataDelete).subscribe( {
    next: (response) => {
      this.notification.success('Xóa nhân viên đi làm lại thành công!')
      this.isDelete = false  
      this.search()
      // this.form.reset()
      // this.getUser(this.idEmployee)
    },
    error: (error) => {
      // if(error.status === 400){
      //   this.notification.error(error.message)
      // }

    }})
}

handleSubmitDelete(){

  const dataDelete ={
    staffId : this.selectedEmployee['id'],
    type : 1,
    fromDate: null,
    toDate: null,
  }

  this.userSevice.updateStatusWork(dataDelete).subscribe( {
    next: (response) => {
      this.notification.success('Xóa nhân viên chờ nghỉ việc thành công!')
      this.isDelete = false  
      this.search()
      // this.form.reset()
      // this.getUser(this.idEmployee)
    },
    error: (error) => {
      // if(error.status === 400){
      //   this.notification.error(error.message)
      // }

    }})

}


  selectedEmployee: any = null;
  openModalonLeave(id: number){
    if (this.dataEmployee && this.dataEmployee.length > 0) {  // Kiểm tra nếu dataEmployee có dữ liệu
        this.isModalOnLeaveEmployee = true;
        this.selectedEmployee = this.dataEmployee.find(emp => emp.id === id);
        if (this.selectedEmployee?.leaveFromDate) {
          const date = new Date(this.selectedEmployee.leaveFromDate);
          this.formChangeInforLeave.patchValue({
            fromDate: date

          });
        }
        if (this.selectedEmployee?.reason) {
          this.formChangeInforLeave.patchValue({
            reason:this.selectedEmployee?.reason
          });
        }
      
    } else {
      console.log("Data Employee is empty or not loaded");
    }
  }

  openModalDelete(id: number){
    if (this.dataEmployee && this.dataEmployee.length > 0) {
      this.selectedEmployee = this.dataEmployee.find(emp => emp.id === id);
      this.isDelete = true
    }
  }

  openModalResest(id : number){
    if (this.dataEmployee && this.dataEmployee.length > 0) {
      this.selectedEmployee = this.dataEmployee.find(emp => emp.id === id);
      this.isResetEmployee = true
  }
}

  checkLeaveType(){

  }

  handleSubmitDeleteVacation(){
      const absenceScheduleId = this.selectedEmployee['absenceScheduleId']

      
  this.userSevice.deleteVacationSchedule(absenceScheduleId).subscribe( {
    next: (response) => {
      this.notification.success('Xóa nghỉ phép thành công!')
      this.isDeleteVacation = false  
      this.search()
      // this.form.reset()
      // this.getUser(this.idEmployee)
    },
    error: (error) => {
      // if(error.status === 400){
      //   this.notification.error(error.message)
      // }

    }})
  }

  deleteVacationSchedule(id: number){
    if (this.dataEmployee && this.dataEmployee.length > 0) {
      this.isDeleteVacation = true;
        this.selectedEmployee = this.dataEmployee.find(emp => emp.id === id);
        console.log(this.selectedEmployee)
    }
  }

  showEmpolyeeNoData(){
    const numberData = 12
    const data = {id: null, name: null, yearOfBirth: null, phoneNumber: null, officeName: null, branchName: null, departmentName: null, reason: null,action : null}
    
    const dataRrows = this.dataEmployee.slice();
    const currentData = dataRrows.length
    if(currentData < numberData){
      const isChangeData = numberData - currentData
      for(let i = 0; i < isChangeData; i++){
        dataRrows.push(data)
      }
    }
    return dataRrows;
  }

  search(){
    const dataForm = {
      ...this.form.value,
      type: 4,
      page:this.pageIndex - 1 < 0 ? 0 : this.pageIndex - 1 ,
      size: 12,
    }

    this.getListEmployee(dataForm)
    const formValue = this.form.value;
    if(formValue){
      localStorage.setItem('search', JSON.stringify(formValue));
    }
    
    this.setupValueIntoForm()
      if(this.changeLeave == 2 || this.changeLeave == '2'){
        this.isLeave = true;
        this.isWaitLeave = false
        this.onLeave  = false
      }
      if(this.changeLeave == 3){
        this.isLeave = false
        this.isWaitLeave = false 
        this.onLeave = false
        this.isChangeEmployee = true
      }
      if(this.changeLeave == 1){
        this.isLeave = false 
        this.isWaitLeave = false 
        this.onLeave = true
      }
    
  }

  resetForm(){
    this.form.reset({
      txtSearch: '',
      branchId: '',
      officeId: '',
      departmentId: '',
      positionId: '',
      leaveType: 1, 
    });
    localStorage.removeItem('search')

  }

  updateWorkStatus(){
    this.formChangeInforLeave.markAllAsTouched()
    
    const dataFormEndWork ={
      staffId : this.selectedEmployee['id'],
      ...this.formChangeInforLeave.value,
      type : 0
    }
    if(this.formChangeInforLeave.invalid){
      this.notification.success('Hãy nhập thông tin thôi việc')
    }else{
      this.userSevice.updateStatusWork(dataFormEndWork).subscribe( {
        next: (response) => {
          this.notification.success('Sửa thông tin thôi việc thành công!')
          this.isModalOnLeaveEmployee = false  
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
  }

  updateWorkStatusOnLeave(){
    const dataFormEndWork ={
      leave_from_date: null,
      type : 1
    }
    this.userSevice.updateStatusWork(dataFormEndWork).subscribe( {
      next: (response) => {
        this.notification.success('Đặt lịch nghỉ phép thành công!')
        this.isModalOnLeaveEmployee = false  
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

  setupValueIntoForm(){
    const formValue = localStorage.getItem('search');
    if(formValue){
      this.form.patchValue(JSON.parse(formValue))
    }
  }

  disableAfterDate(name: string): (afterDate: Date | null) => boolean {
    return (afterDate: Date | null): boolean => {
      if (!afterDate || !this.formOnLeave) return false;
  
      const beforeDate = this.formOnLeave.get(name)?.value;
      const today = new Date();
      // Đặt giờ, phút, giây, và mili giây của ngày hôm nay về 0 để chỉ so sánh ngày
      today.setHours(0, 0, 0, 0);
      // Nếu không có beforeDate, chỉ kiểm tra ngày hôm nay
      if (!beforeDate) {
        return afterDate <= today;
      }
      const beforeDateObject = new Date(beforeDate);
      // Ngày được chọn phải lớn hơn hôm nay và nhỏ hơn beforeDate
      return afterDate <= today || afterDate >= beforeDateObject;
    };
  }
  
  
  disableBeforeDate(name: string): (beforeDate: Date | null) => boolean {
    return (beforeDate: Date | null): boolean => {
      if (!beforeDate || !this.formOnLeave) return false;
      const afterDate = this.formOnLeave.get(name)?.value;
      if (!afterDate || !this.formOnLeave) return false;
  
      const today = new Date()
      today.setHours(0, 0, 0, 0);

      if(!afterDate){
        return beforeDate <= today
      }
      const AfterDateObject = new Date(afterDate);
  
      return afterDate <= today || beforeDate <= AfterDateObject;
    };
  }

  leaveToDate: any
  leaveFromDate: any
  workingStatusNumChange  : number = 0
  isOnLeave: boolean = false;
  openModalChangeonLeave(data: any){
    if (this.dataEmployee && this.dataEmployee.length > 0) {  // Kiểm tra nếu dataEmployee có dữ liệu
      this.isLeaveType3 = true;
      this.selectedEmployee = data;
      this.leaveToDate = this.selectedEmployee?.leaveToDate ? new Date(this.selectedEmployee.leaveToDate) : null
      this.leaveFromDate = this.selectedEmployee?.leaveFromDate ? new Date(this.selectedEmployee.leaveFromDate) : null
      this.workingStatusNumChange = this.selectedEmployee?.workingStatusNum

      console.log(this.selectedEmployee)
      const toDay = new Date()
     
      this.formLeaveType3.patchValue({
        fromDate: this.leaveFromDate, 
        toDate: this.leaveToDate,    
        reason: this.selectedEmployee?.reason || '', 
      });
      if (this.leaveFromDate && this.leaveToDate) {
        this.isOnLeave = this.leaveFromDate <= toDay && toDay <= this.leaveToDate;
        // this.isOnLeave = true
      } else {
        this.isOnLeave = false; // Không hiển thị nếu thiếu dữ liệu ngày
      }

    } else {
      // console.log("Data Employee is empty or not loaded");
      // this.notification.error('Đặt lịch nghỉ phép thành công!')
    }
  }
}

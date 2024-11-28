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
    private notification: NotificationService
  ){
   
  }
  form!: FormGroup
  formChangeInforLeave !: FormGroup


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
      console.log(this.changeLeave)
    })
  }

  listBranch: any[] = []
  listPosstion: any[] = []
  listOffice: any[] = []
  listDepartment: any[] = []
  isModalOnLeaveEmployee = false
  dataEmployee: any[] = []
  isResetEmployee: boolean = false
  isDelete: boolean = false
  changeLeave: any
  isWaitLeave :boolean = false
  onLeave : boolean = false
  isLeave: boolean = false


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
  onDateChange(date: Date): void {
    if (date) {
      this.isoDate = date.toISOString(); // Chuyển đổi sang ISO 8601
      // console.log(this.isoDate)
    } else {
      this.isoDate = null;
    }

    this.form.get('toDate')?.updateValueAndValidity()
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
      // console.log(response)
      this.dataEmployee = response.data.content
      this.total = response.data.totalElements
      console.log(this.total)
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

}

handleSubmitDelete(){

}


  selectedEmployee: any = null;
  openModalonLeave(id: number){
    if (this.dataEmployee && this.dataEmployee.length > 0) {  // Kiểm tra nếu dataEmployee có dữ liệu
      console.log(this.changeLeave)
      if(this.changeLeave == 2 || this.changeLeave == '2'){
        this.isResetEmployee = true;
        this.selectedEmployee = this.dataEmployee.find(emp => emp.id === id);
      }else{
        this.isModalOnLeaveEmployee = true;
        this.selectedEmployee = this.dataEmployee.find(emp => emp.id === id);
      }
      
      console.log("Selected Employee:", this.selectedEmployee);  // Kiểm tra giá trị của selectedEmployee
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


  checkLeaveType(){

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
    
    // console.log(formValue)
    this.setupValueIntoForm()
      if(this.changeLeave == 2 || this.changeLeave == '2'){
        this.isLeave = true;
        this.isWaitLeave = false
        this.onLeave  = false
      }
      if(this.changeLeave == 3){
        this.isLeave = false
        this.isWaitLeave = true 
        this.onLeave = true
      }
      if(this.changeLeave == 1){
        this.isLeave = false 
        this.isWaitLeave = false 
        this.onLeave = true
      }
    
  }

  resetForm(){
    this.form.reset()
  }

  updateWorkStatus(){
    this.formChangeInforLeave.markAllAsTouched()
    const dataFormEndWork ={
      staffId : this.selectedEmployee['id'],
      ...this.formChangeInforLeave.value,
      type : 4
    }
    console.log(dataFormEndWork)

    if(this.formChangeInforLeave.invalid){
      this.notification.success('Hãy lập lịch nghỉ phép')

    }else{
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
  }

  updateWorkStatusOnLeave(){
    const dataFormEndWork ={
      leave_from_date: null,
      type : 1
    }
    console.log(dataFormEndWork)

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
    console.log(formValue)
    if(formValue){
      this.form.patchValue(JSON.parse(formValue))
    }
  }


}

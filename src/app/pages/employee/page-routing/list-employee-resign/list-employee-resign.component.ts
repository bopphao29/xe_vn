import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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


  ngOnInit(): void {

    this.form = this.fb.group({
      // code: '',
      // name: '',
      // phoneNumber: '',
      txtSearch:'',
      officeId: '',
      branchId: '',
      departmentId: '',
      positionId: '',
      leaveType: 1

    })
    // this.listData
    const formData = {
      type : 4,
      page: this.pageIndex,
      size: 12,
      ...this.form.value}
    console.log(this.pageSize)
    this.getListEmployee(this.pageIndex, this.pageSize, formData)
    this.getBranch()
    this.getDepartment()
    this.getOffice()
    this.getPossition()
  }

  listBranch: any[] = []
  listPosstion: any[] = []
  listOffice: any[] = []
  listDepartment: any[] = []
  isModalOnLeaveEmployee = false
  dataEmployee: any[] = []
  formOnLeave !: FormGroup

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

  pageIndex = 0
  pageSize = 10

  pagedData : any[] = []

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.getListEmployee(this.pageIndex, this.pageSize,this.form.value);
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

  getListEmployee(page: number, size: number, data: any){
    this.userSevice.searchEmployee(data ).subscribe((response: any)=>{
      // console.log(response)
      this.dataEmployee = response.data.content
      this.total = response.data.totalElements
      console.log(this.total)

    })
  }

  handleCancel() {
    this.isModalOnLeaveEmployee = false
    
  }

  handleSubmit(): void {
    this.isModalOnLeaveEmployee = false;
  }
  selectedEmployee: any = null;
  openModalonLeave(id: number){
    if (this.dataEmployee && this.dataEmployee.length > 0) {  // Kiểm tra nếu dataEmployee có dữ liệu
      this.isModalOnLeaveEmployee = true;
      this.selectedEmployee = this.dataEmployee.find(emp => emp.id === id);
      console.log("Selected Employee:", this.selectedEmployee);  // Kiểm tra giá trị của selectedEmployee
    } else {
      console.log("Data Employee is empty or not loaded");
    }
  }

  showEmpolyeeNoData(){
    const numberData = 12
    const data = {id: null, name: null, yearOfBirth: null, phoneNumber: null, officeName: null, branchName: null, departmentName: null, reason: null}
    
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
      type: 4,
      page:this.pageIndex,
      size: 12,
      ...this.form.value
    }

    console.log(dataForm)
    this.userSevice.searchEmployee( dataForm).subscribe((response: any)=>{
      console.log(response)
      
    })
    this.getListEmployee(this.pageIndex , this.pageSize, dataForm)
  }

  resetForm(){
    this.form.reset()
  }

  updateWorkStatus(){
    this.formOnLeave.markAllAsTouched()
    const dataFormEndWork ={
      staffId : this.selectedEmployee['id'],
      ...this.formOnLeave.value,
      type : 4
    }
    console.log(dataFormEndWork)

    if(this.formOnLeave.invalid){
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


}

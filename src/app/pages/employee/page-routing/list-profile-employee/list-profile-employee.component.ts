import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { DetailProfileEmployeeComponent } from '../../detail-profile-employee/detail-profile-employee.component';
import { Route, Router, Routes } from '@angular/router';
import { UserServiceService } from '../../../../shared/services/user-service.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { SearchEmployeeProfileService } from '../../../../shared/services/search-employee-profile.service';



@Component({
  selector: 'app-list-profile-employee',
  standalone: true,
  templateUrl: './list-profile-employee.component.html',
  styleUrl: './list-profile-employee.component.scss',
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
    DetailProfileEmployeeComponent
  ],
})
export class ListProfileEmployeeComponent implements OnInit {

  constructor(
    private routes: Router,
    private fb :FormBuilder,
    private userSevice: UserServiceService,
    private notification: NotificationService,
    private searchEmployeeProfile : SearchEmployeeProfileService 
 
  ){

  }

  form!: FormGroup
  formOnLeave !: FormGroup


  ngOnInit(): void {

    this.form = this.fb.group({
      // code: '',
      // name: '',
      // phoneNumber: '',
      txtSearch: '',
      officeId: '',
      branchId: '',
      departmentId: '',
      positionId: '',

    })
    // this.listData
    // const formData = {
    //   page: this.pageIndex,
    //   size: 12,
    //   ...this.form.value}
    // console.log(this.pageSize)
    // this.getListEmployee(formData)
    this.search()
    this.getBranch()
    this.getDepartment()
    this.getOffice()
    this.getPossition()

    this.formOnLeave = this.fb.group({
      fromDate: ['', Validators.required],
      toDate : ['', Validators.required]
    })

    const saveSearch = this.searchEmployeeProfile.search;
    console.log(saveSearch)
    
     const a=  this.form.get('txtSearch')?.setValue(saveSearch.txtSearch)
      this.form.get('officeId')?.setValue(saveSearch.officeId)

      this.form.get('branchId')?.setValue(saveSearch.branchId)
      this.form.get('txtSearch')?.setValue(saveSearch.txtSearch)
      this.form.get('txtSearch')?.setValue(saveSearch.txtSearch)


    
    
  }

  listBranch: any[] = []
  listPosstion: any[] = []
  listOffice: any[] = []
  listDepartment: any[] = []
  isModalOnLeaveEmployee = false


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
    
    this.search();
  }
  
  
  routerDetailEmployee(id: any){
    this.routes.navigate(['/detail-employee/', id])
  }
  // routerDetailEmployee(){
  //   this.routes.navigate(['/employee-details/1'])
  // }

  dataEmployee: any[] = []

  total = 0

  getListEmployee(data: any){
    this.userSevice.searchEmployee(data ).subscribe((response: any)=>{
      // console.log(response)
      this.dataEmployee = response.data.content
      this.total = response.data.totalElements
      console.log(this.total)

    })
  }

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

  ///////////////////////////show dữ liệu không có/////////////////////
  showEmpolyeeNoData(){
    const numberData = 12
    const data = {id: null, name: null, yearOfBirth: null, phoneNumber: null, officeName: null, branchName: null, departmentName: null, positionName: null}
    
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
    } else {
      // console.log("Data Employee is empty or not loaded");
      // this.notification.error('Đặt lịch nghỉ phép thành công!')


    }
  }

  search(){
    const dataForm = {
      type: 1,
      page:this.pageIndex - 1 < 0 ? 0 : this.pageIndex - 1 ,
      size: 12,
      ...this.form.value
    }
    this.searchEmployeeProfile.search = this.form.value

    const saveSearch = this.searchEmployeeProfile.search;
    
    this.form.get('txtSearch')?.setValue(saveSearch.txtSearch)

    console.log("giá trị ", this.form.get('txtSearch')?.value)


    // console.log(dataForm)
    this.userSevice.searchEmployee(dataForm).subscribe((response: any)=>{
      console.log(response)
      
    })
    this.getListEmployee(dataForm )
  }

  resetForm(){
    this.form.reset()
  }

  updateWorkStatus(){
    this.formOnLeave.markAllAsTouched()
    const dataFormEndWork ={
      staffId : this.selectedEmployee['id'],
      ...this.formOnLeave.value,
      type : 2
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

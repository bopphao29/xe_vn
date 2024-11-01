import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { DetailProfileEmployeeComponent } from '../detail-profile-employee/detail-profile-employee.component';
import { Route, Router, Routes } from '@angular/router';
import { UserServiceService } from '../../shared/user-service/user-service.service';

@Component({
  selector: 'app-list-employee-probation',
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
  templateUrl: './list-employee-probation.component.html',
  styleUrl: './list-employee-probation.component.scss'
})
export class ListEmployeeProbationComponent implements OnInit  {

  constructor(
    private routes: Router,
    private fb :FormBuilder,
    private userSevice: UserServiceService
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

    })
    // this.listData
    console.log(this.pageSize)
    this.getListEmployee(this.pageIndex, this.pageSize, this.form.value)
    this.getBranch()
    this.getDepartment()
    this.getOffice()
    this.getPossition()
  }

  listBranch: any[] = []
  listPosstion: any[] = []
  listOffice: any[] = []
  listDepartment: any[] = []

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


  pageIndex = 0
  pageSize = 10

  pagedData : any[] = []

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.getListEmployee(this.pageIndex, this.pageSize,this.form.value);
  }

  
  routerDetailEmployee(id: any){
    this.routes.navigate(['/employee-details/', id])
  }

  dataEmployee: any[] = []

  total = 1

  getListEmployee(page: number, size: number, data: any){
    this.userSevice.searchEmployee(page,size,data ).subscribe((response: any)=>{
      // console.log(response)
      this.dataEmployee = response.data.content
      this.total = response.data.totalElements
      console.log(this.total)

    })
  }

  search(){
    const dataForm = {
      type: 2,
      ...this.form.value
    }

    console.log(dataForm)
    this.userSevice.searchEmployee(this.pageIndex, this.pageSize, dataForm).subscribe((response: any)=>{
      console.log(response)
      
    })
    this.getListEmployee(this.pageIndex , this.pageSize, dataForm)
  }

  resetForm(){
    this.form.reset()
  }
}

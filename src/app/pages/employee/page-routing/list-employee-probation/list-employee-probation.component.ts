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
import { DetailProfileEmployeeComponent } from '../../detail-profile-employee/detail-profile-employee.component';
import { Route, Router, Routes } from '@angular/router';
import { UserServiceService } from '../../../../shared/services/user-service.service';


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
    this.getBranch()
    // this.getDepartment()
    this.getOffice()
    this.getPossition()
    this.search()
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
    this.search()
  }

  
  routerDetailEmployee(id: any){
    this.routes.navigate(['detail-employee/', id])
  }

  dataEmployee: any[] = [] 

  total = 1

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


  getListEmployeeProbation(data: any){
    this.userSevice.searchEmployee(data ).subscribe((response: any)=>{
      // console.log(response)
      this.dataEmployee = response.data.content
      this.total = response.data.totalElements
      console.log(this.total)

    })
  }

  
  search(){
    const dataForm = {
      ...this.form.value,
      type: 2,
      page: this.pageIndex - 1 < 0 ? 0 : this.pageIndex - 1 ,
      size: 12,
    }
    this.getListEmployeeProbation(dataForm)
  }

  resetForm(){
    this.form.reset()
  }
}

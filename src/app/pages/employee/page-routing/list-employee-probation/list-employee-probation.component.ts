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
import Swal from 'sweetalert2';


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
    const savedFormValue = localStorage.getItem('search');
    this.form = this.fb.group({
      txtSearch: [savedFormValue ? JSON.parse(savedFormValue).txtSearch : ''],
      officeId: [savedFormValue ? JSON.parse(savedFormValue).officeId : ''],
      branchId: [savedFormValue ? JSON.parse(savedFormValue).branchId : ''],
      departmentId: [savedFormValue ? JSON.parse(savedFormValue).departmentId : ''],
      positionId: [savedFormValue ? JSON.parse(savedFormValue).positionId : ''],
    })
    // this.listData
    this.getBranch()
    // this.getDepartment()
    this.getOffice()
    this.getPossition()
    this.search()
    this.setupValueIntoForm()
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

  
  search(){
    const dataForm = {
      ...this.form.value,
      type: 2,
      page: this.pageIndex - 1 < 0 ? 0 : this.pageIndex - 1 ,
      size: 12,
    }
    this.getListEmployeeProbation(dataForm)
    const formValue = this.form.value;
    console.log(formValue)
    if(formValue){
      // localStorage.removeItem('searchEmployee')
      localStorage.setItem('search', JSON.stringify(formValue));
    }
    
    console.log(this.form.value)
    console.log(formValue)
    this.setupValueIntoForm()

  }

  resetForm(){
    this.form.get('txtSearch')?.setValue('')
    this.form.get('officeId')?.setValue('')
    this.form.get('branchId')?.setValue('')
    this.form.get('departmentId')?.setValue('')
    this.form.get('positionId')?.setValue('')
    localStorage.removeItem('search')
  }

  setupValueIntoForm(){
    const formValue = localStorage.getItem('search');
    console.log(formValue)
    if(formValue){
      this.form.patchValue(JSON.parse(formValue))
    }
  }

}

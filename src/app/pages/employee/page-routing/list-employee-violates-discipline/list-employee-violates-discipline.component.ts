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
import { Router } from '@angular/router';
import { UserServiceService } from '../../../../shared/services/user-service/user-service.service';

@Component({
  selector: 'app-list-employee-violates-discipline',
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
  templateUrl: './list-employee-violates-discipline.component.html',
  styleUrl: './list-employee-violates-discipline.component.scss'
})
export class ListEmployeeViolatesDisciplineComponent implements OnInit{

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
    const formData = {
      type : 3,
      page: this.pageIndex,
      size: 12,
      ...this.form.value}
    console.log(this.pageSize)
    this.getListEmployee(this.pageIndex, this.pageSize, formData)
    this.getBranch()
    // this.getDepartment()
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

  dataEmployee: any[] = [] 

  total = 1

  getListEmployee(page: number, size: number, data: any){
    this.userSevice.searchEmployee(data ).subscribe((response: any)=>{
      // console.log(response)
      this.dataEmployee = response.data.content
      this.total = response.data.totalElements
      console.log(this.total)

    })
  }

  search(){
    const dataForm = {
      type: 3,
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
}

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
import { UserServiceService } from '../../../../shared/services/user-service.service';


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
      violentId: '',
      rangeDate: ''
    })
    // this.listData
    this.search()
    this.getBranch()
    // this.getDepartment()
    this.getPunishmentsContents()

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

  listPunishmentsContent : any[] = []
  getPunishmentsContents(){
    this.userSevice.getPunishmentsContents().subscribe((response: any)=>{
      this.listPunishmentsContent = response.data
      console.log(response)
    })
  }

  pageIndex = 1
  pageSize = 10

  pagedData : any[] = []

  onPageChange(page: number): void {
    this.pageIndex = page;
    
    this.search();

  }

  
  routerDetailEmployee(id: any){
    this.routes.navigate(['detail-employee-violate/', id])
  }

  dataEmployee: any[] = [] 

  total = 1

  getListEmployee(data: any){
    this.userSevice.searchEmployee(data ).subscribe((response: any)=>{
      // console.log(response)
      this.dataEmployee = response.data.content
      this.total = response.data.totalElements
      console.log(this.total)

    })
  }

  fromDate : Date = new Date()
  toDate : Date = new Date()

  getToDateAndFromDate(){
    const rangeDate = this.form.get('rangeDate')?.value
     this.fromDate = rangeDate ? rangeDate[0] : null
    this.toDate = rangeDate ? rangeDate[1] : null

    console.log(this.fromDate)
    console.log(this.toDate)
  }

  ///////////////////////////show dữ liệu không có/////////////////////
  showEmpolyeeNoData(){
    const numberData = 12
    const data = {id: null, name: null, yearOfBirth: null, phoneNumber: null, officeName: null, branchName: null, punishmentForm: null, lastModifiedDate: null}
    
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
    const checkRangDate = this.form.get('rangeDate')?.invalid
    this.form.updateValueAndValidity();
    const dataForm = {
      violentDateFrom : checkRangDate ? this.fromDate : '',
      violentDateTo: checkRangDate ? this.toDate : '',
      ...this.form.value,
      type: 3,
      page: this.pageIndex - 1 < 0 ? 0 : this.pageIndex - 1 ,
      size: 12,
    }
    delete dataForm.rangeDate

    console.log(dataForm)
    this.userSevice.searchEmployee( dataForm).subscribe((response: any)=>{
      console.log(response)
      
    })
    this.getListEmployee(dataForm)
  }

  resetForm(){
    this.form.reset()
  }


}

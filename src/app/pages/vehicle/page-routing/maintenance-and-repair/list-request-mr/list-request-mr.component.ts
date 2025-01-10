import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { VehicalServiceService } from '../../../../../shared/services/vehical-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-request-mr',
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
  providers: [DatePipe],
  templateUrl: './list-request-mr.component.html',
  styleUrl: './list-request-mr.component.scss'
})
export class ListRequestMrComponent implements OnInit{

  @Output() dataEmmitter = new EventEmitter<string>()

  routerLink(){
    this.dataEmmitter.emit('list-request')
  }
  constructor(
    private fb: FormBuilder,
    private vehicleServices: VehicalServiceService,
    private routes :Router,
    private datePipe: DatePipe,
    
  ){
  }
  
  form !: FormGroup
  ngOnInit(): void {

  const savedFormValue = localStorage.getItem('search');
  this.form = this.fb.group({
    status: [savedFormValue ? JSON.parse(savedFormValue).status : ''],
    txtSearch: [savedFormValue ? JSON.parse(savedFormValue).txtSearch : ''],
    rangeDate: [savedFormValue ? JSON.parse(savedFormValue).rangeDate : ''],
  });
    this.search()
  }

  listStatus = [
    {id: 1, value:'Đã duyệt'},
    {id: 2, value:'Chờ duyệt'},
    {id: 3, value:'Đang sửa chữa'},
    {id: 4, value:'Không được duyệt'},
    {id: 5, value:'Đã hoàn thành'},
  ]

  dataMRC: any[] = [] 
  total = 1
  pageIndex = 1
  pageSize = 12

    getListMR(data: any){
      this.vehicleServices.mRChedulessearch(this.pageIndex - 1, this.pageSize ,data).subscribe((response: any)=>{
        this.dataMRC = response.data.content
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

  startDate : Date | null = new Date()
  endDate : Date | null = new Date()
  search(){
    const formmatDate = 'yyyy-MM-dd'

    const rangeDate = this.form.get('rangeDate')?.value
    if(rangeDate != null){
      this.startDate =  rangeDate[0]
      this.endDate = rangeDate[1]
    }else{
      this.startDate =  null 
      this.endDate =  null
    }
    this.form.updateValueAndValidity();
    const dataForm = {
      ...this.form.value,
      startDate : rangeDate ? this.datePipe.transform( this.startDate, formmatDate) : '',
      endDate: rangeDate ? this.datePipe.transform( this.endDate, formmatDate) : '',
      // page: this.pageIndex - 1 < 0 ? 0 : this.pageIndex - 1 ,
      // size: 12,
    }

    delete dataForm.rangeDate
    console.log(dataForm)
    this.getListMR(dataForm)
    const formValue = this.form.value;
    console.log(formValue)
    if(formValue){
      // localStorage.removeItem('searchEmployee')
      localStorage.setItem('search', JSON.stringify(formValue));
    }
    this.setupValueIntoForm()

  }

  setupValueIntoForm(){
    const formValue = localStorage.getItem('search');
    console.log(formValue)
    if(formValue){
      this.form.patchValue(JSON.parse(formValue))
    }
  }

  resetForm(){
    this.form.reset()
    this.form.get('status')?.setValue('')
  }

  list: any[] = []

  routerDetailEmployee(data: any){

  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.search()
  }

  showEmpolyeeNoData(){
    const numberData = 12
    const data = {id: null, name: null, yearOfBirth: null, phoneNumber: null, officeName: null, branchName: null, departmentName: null, positionName: null}
    
    const dataRrows = this.dataMRC.slice();
    const currentData = dataRrows.length
    if(currentData < numberData){
      const isChangeData = numberData - currentData
      for(let i = 0; i < isChangeData; i++){
        dataRrows.push(data)
      }
    }
    return dataRrows;
  }

  routerDetail(id: any){
    this.routes.navigate(['/vehicle/detail-mr/', id])
  }
}

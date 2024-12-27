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
import Swal from 'sweetalert2';
import { NotificationService } from '../../../../shared/services/notification.service';


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
    private userSevice: UserServiceService,
    private notification: NotificationService
  ){
   
  }
  form!: FormGroup
  formOnLeave !: FormGroup



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

    this.formOnLeave = this.fb.group({
          fromDate: ['', Validators.required],
          toDate : ['', Validators.required],
          reason: ['', Validators.required]
    
        })
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


  listDayOfVS: any[] = []
  getVacationSchedules(id: any){
    this.userSevice.getVacationSchedules(id).subscribe((response: any)=> {
      console.log(response)
      this.listDayOfVS = response.data

    })
  }
  
  isModalOnLeaveEmployee = false
  selectedEmployee: any = null;
  leaveToDate: any
  leaveFromDate: any
  workingStatusNum  : number = 0
  isOnLeave: boolean = false;

  openModalonLeave(id: number){
    if (this.dataEmployee && this.dataEmployee.length > 0) {  // Kiểm tra nếu dataEmployee có dữ liệu
      this.isModalOnLeaveEmployee = true;
      this.selectedEmployee = this.dataEmployee.find(emp => emp.id === id);
      this.leaveToDate = this.selectedEmployee?.leaveToDate ? new Date(this.selectedEmployee.leaveToDate) : null
      this.leaveFromDate = this.selectedEmployee?.leaveFromDate ? new Date(this.selectedEmployee.leaveFromDate) : null
      this.workingStatusNum = this.selectedEmployee?.workingStatusNum

      console.log(this.selectedEmployee?.id)
      this.getVacationSchedules(this.selectedEmployee?.id)
      const toDay = new Date()
     
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

  
  isDateInRange(fromDate: string, toDate: string): boolean {
    const today = new Date(); // Ngày hiện tại
    const from = new Date(fromDate);
    const to = new Date(toDate);
  
    // Kiểm tra nếu ngày hôm nay nằm trong khoảng [fromDate, toDate]
    return from <= today && today <= to;
  }
  
  handleCancel() {
    this.isModalOnLeaveEmployee = false
    this.formOnLeave.reset()
  }

  handleSubmit(): void {
    this.isModalOnLeaveEmployee = false;
  }
  
  disableAfterDate(name: string): (afterDate: Date | null) => boolean {
    return (afterDate: Date | null): boolean => {
      if (!afterDate || !this.formOnLeave) return false;
  
      const beforeDate = this.formOnLeave.get(name)?.value;
      if (!beforeDate) return false;
  
      // Chuẩn hóa ngày trước và ngày sau (bỏ giờ/phút/giây)
      const normalizedAfterDate = new Date(afterDate);
      normalizedAfterDate.setHours(0, 0, 0, 0);
  
      const normalizedBeforeDate = new Date(beforeDate);
      normalizedBeforeDate.setHours(0, 0, 0, 0);
  
      // Kiểm tra ngày
      if (normalizedAfterDate < normalizedBeforeDate) {
        return true; // Vô hiệu hóa nếu ngày sau < ngày trước
      }
  
      // Nếu ngày giống nhau, kiểm tra giờ/phút
      if (normalizedAfterDate.getTime() === normalizedBeforeDate.getTime()) {
        const afterHours = afterDate.getHours();
        const afterMinutes = afterDate.getMinutes();
        const beforeHours = new Date(beforeDate).getHours();
        const beforeMinutes = new Date(beforeDate).getMinutes();
  
        if (afterHours < beforeHours || (afterHours === beforeHours && afterMinutes <= beforeMinutes)) {
          return true; // Vô hiệu hóa nếu giờ/phút không hợp lệ
        }
      }
  
      return false; // Ngày hợp lệ
    };
  }

  disableBeforeDate(name: string): (beforeDate: Date | null) => boolean {
    return (beforeDate: Date | null): boolean => {
      if (!beforeDate || !this.formOnLeave) return false;
  
      const afterDate = this.formOnLeave.get(name)?.value;
      if (!afterDate) return false;
  
      // Chuẩn hóa ngày trước và ngày sau (bỏ giờ/phút/giây)
      const normalizedBeforeDate = new Date(beforeDate);
      normalizedBeforeDate.setHours(0, 0, 0, 0);
  
      const normalizedAfterDate = new Date(afterDate);
      normalizedAfterDate.setHours(0, 0, 0, 0);
  
      // Kiểm tra ngày
      if (normalizedBeforeDate > normalizedAfterDate) {
        return true; // Vô hiệu hóa nếu ngày trước > ngày sau
      }
  
      // Nếu ngày giống nhau, kiểm tra giờ/phút
      if (normalizedBeforeDate.getTime() === normalizedAfterDate.getTime()) {
        const beforeHours = beforeDate.getHours();
        const beforeMinutes = beforeDate.getMinutes();
        const afterHours = new Date(afterDate).getHours();
        const afterMinutes = new Date(afterDate).getMinutes();
  
        if (beforeHours > afterHours || (beforeHours === afterHours && beforeMinutes >= afterMinutes)) {
          return true; // Vô hiệu hóa nếu giờ/phút không hợp lệ
        }
      }
  
      return false; // Ngày hợp lệ
    };
  }

  updateWorkStatus(){
    this.formOnLeave.markAllAsTouched()
    const dataFormEndWork ={
      staffId : this.selectedEmployee['id'],
      ...this.formOnLeave.value,
      type : 2
    }

    if(this.formOnLeave.invalid){
      this.notification.error('Hãy lập lịch nghỉ phép')

    }else{
      this.userSevice.updateStatusWork(dataFormEndWork).subscribe( {
        next: (response) => {
          this.notification.success('Đặt lịch nghỉ phép thành công!')
          this.isModalOnLeaveEmployee = false
          this.formOnLeave.reset()
          this.search()
          // window.location.reload();
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

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
import Swal from 'sweetalert2';
import { DisableService } from '../../../../shared/services/disable.service';



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
    private searchEmployeeProfile : SearchEmployeeProfileService,
    private disableService: DisableService
  ){

  }

  form!: FormGroup
  formOnLeave !: FormGroup


  ngOnInit(): void {
    const savedFormValue = localStorage.getItem('search');
  // Khởi tạo form với giá trị từ localStorage nếu có, ngược lại dùng giá trị mặc định
  this.form = this.fb.group({
    txtSearch: [savedFormValue ? JSON.parse(savedFormValue).txtSearch : ''],
    officeId: [savedFormValue ? JSON.parse(savedFormValue).officeId : ''],
    branchId: [savedFormValue ? JSON.parse(savedFormValue).branchId : ''],
    departmentId: [savedFormValue ? JSON.parse(savedFormValue).departmentId : ''],
    positionId: [savedFormValue ? JSON.parse(savedFormValue).positionId : ''],
    workingStatus: [savedFormValue ? JSON.parse(savedFormValue).workingStatus : ''],
    // reason: [savedFormValue ? JSON.parse(savedFormValue).reason : ''],
  });
    this.search()
    this.getBranch()
    this.getDepartment()
    this.getOffice()
    this.getPossition()
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
  isModalOnLeaveEmployee = false

  listStatus = [
    {id : 1, value: "Đang làm việc"},
    {id : 2, value: "Nghỉ phép"}
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
    this.routes.navigate(['/detail-employee/', id])
  }

  dataEmployee: any[] = []

  total = 0
  getListEmployee(data: any){
    this.userSevice.searchEmployee(data ).subscribe((response: any)=>{
      this.dataEmployee = response.data.content
      this.total = response.data.totalElements
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

  isoDate: string | null = null;
  onDateChange(date: Date): void {
    if (date) {
      this.isoDate = date.toISOString(); // Chuyển đổi sang ISO 8601
    } else {
      this.isoDate = null;
    }

    // this.form.get('toDate')?.updateValueAndValidity()
  }

  disableIntoToDate = (toDate: Date): boolean => {
    const fromDate = this.form.get('fromDate')?.value;
  const parsedFromDate = fromDate ? new Date(fromDate) : null;

  if (parsedFromDate) {
    parsedFromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);
  }

  return parsedFromDate ? toDate >= parsedFromDate : false;
  };

  disableFromDate = (fromDate: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt giờ của today về 00:00:00
    const toDate = this.form.get('toDate')?.value;
  
    // fromDate phải lớn hơn hoặc bằng today và nhỏ hơn toDate (nếu toDate tồn tại)
    return fromDate < today || (toDate && fromDate >= toDate);
  };
  

  ///////////////////////////show dữ liệu không có/////////////////////
  showEmpolyeeNoData(){
    const numberData = 12
    const data = {id: null, name: null, yearOfBirth: null, phoneNumber: null, officeName: null, branchName: null, departmentName: null, positionName: null, workingStatus: null}
    
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
    this.formOnLeave.reset()
  }

  handleSubmit(): void {
    this.isModalOnLeaveEmployee = false;
  }

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

      console.log(this.leaveToDate)
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

  search(){
    const dataForm = {
      ...this.form.value,
      type: 1,
      page:this.pageIndex - 1 < 0 ? 0 : this.pageIndex - 1 ,
      size: 12,
    }
    this.getListEmployee(dataForm )
    const formValue = this.form.value;
    if(formValue){
      localStorage.setItem('search', JSON.stringify(formValue));
    }
    
    this.setupValueIntoForm()
  }

  resetForm(){
    this.form.get('txtSearch')?.setValue('')
    this.form.get('officeId')?.setValue('')
    this.form.get('branchId')?.setValue('')
    this.form.get('departmentId')?.setValue('')
    this.form.get('positionId')?.setValue('')
    this.form.get('status')?.setValue('')
    localStorage.removeItem('search')
  }

    ////////////////////////////////////////Lưu local storage các trường cần tìm kiếm/////////////////////////////////////////

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

  setupValueIntoForm(){
    const formValue = localStorage.getItem('search');
    if(formValue){
      this.form.patchValue(JSON.parse(formValue))
    }
  }

  disableAfterDate(name: string): (afterDate: Date | null) => boolean {
    return (afterDate: Date | null): boolean => {
      if (!afterDate || !this.formOnLeave) return false;
  
      const beforeDate = this.formOnLeave.get(name)?.value;
      const today = new Date();
      // Đặt giờ, phút, giây, và mili giây của ngày hôm nay về 0 để chỉ so sánh ngày
      today.setHours(0, 0, 0, 0);
      // Nếu không có beforeDate, chỉ kiểm tra ngày hôm nay
      if (!beforeDate) {
        return afterDate <= today;
      }
      const beforeDateObject = new Date(beforeDate);
      // Ngày được chọn phải lớn hơn hôm nay và nhỏ hơn beforeDate
      return afterDate <= today || afterDate >= beforeDateObject;
    };
  }
  
  
  disableBeforeDate(name: string): (beforeDate: Date | null) => boolean {
    return (beforeDate: Date | null): boolean => {
      if (!beforeDate || !this.formOnLeave) return false;
      const afterDate = this.formOnLeave.get(name)?.value;
      if (!afterDate || !this.formOnLeave) return false;
  
      const today = new Date()
      today.setHours(0, 0, 0, 0);

      if(!afterDate){
        return beforeDate <= today
      }
      const AfterDateObject = new Date(afterDate);
  
      return afterDate <= today || beforeDate <= AfterDateObject;
    };
  }
  

}

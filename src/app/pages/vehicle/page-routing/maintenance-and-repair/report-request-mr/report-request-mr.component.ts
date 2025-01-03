import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-report-request-mr',
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
    NzPaginationModule
  ],
  templateUrl: './report-request-mr.component.html',
  styleUrl: './report-request-mr.component.scss'
})
export class ReportRequestMrComponent implements OnInit{
  @Input() data = ''

  form !: FormGroup
  constructor(
    private routes: Router,
    private vehicleServices :VehicalServiceService,
    private fb: FormBuilder,
    
  ){}
  total = 1
  pageIndex = 1
  pageSize = 4

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      // this.getAdminAccountInfo(this.data.adminAccountId);
      console.log(this.data);

    }
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.search()
  }

  ngOnInit(): void {
    const savedFormValue = localStorage.getItem('search');

    this.form = this.fb.group({
    routeId: [savedFormValue ? JSON.parse(savedFormValue).routeId : ''],
    registerNo: [savedFormValue ? JSON.parse(savedFormValue).registerNo : ''],
    vehicleTypeId : [savedFormValue ? JSON.parse(savedFormValue).vehicleTypeId : ''],
    manufactureYear: [savedFormValue ? JSON.parse(savedFormValue).manufactureYear : ''],
    indentedUse: [savedFormValue ? JSON.parse(savedFormValue).indentedUse : '']

  })

    this.search()
  }

  listManufactureYears : any[] =[]

  listManufacture : any[] =[]

  dataLMRC : any[] = []
  showEmpolyeeNoData(){
    const numberData = 4
    const data = {registerNo: null, vehicleType: null, manufacturerYear: null, odometer: null, driver: null, numberOfMaintenance: null, vehicleStatuses: null, hours: null, worksPerformed: null, replacementSupplies: null}
    
    const dataRrows = (this.dataLMRC || []).slice();
    const currentData = dataRrows.length
    if(currentData < numberData){
      const isChangeData = numberData - currentData
      for(let i = 0; i < isChangeData; i++){
        dataRrows.push(data)
      }
    }
    return dataRrows;
  }

  listRoute: any[] = []
  is_New: any
  getRoute(){
    this.vehicleServices.getRoute().subscribe((response : any)=> {
      this.listRoute = response.data
    })
  }

  search(){
    const dataForm = {
      ...this.form.value
    }

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

  inforBDSC: any

  getListMR(data: any){
        this.vehicleServices.summaryReport(this.pageIndex - 1,this.pageSize, data).subscribe((response: any)=>{
          this.dataLMRC = response.data?.pageSummary?.content
          this.inforBDSC = response.data
          this.total = response.data?.pageSummary?.totalElements
          console.log(response)
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

  routerDetail(registerNo: any){
    this.routes.navigate(['/vehicle/detail-report-mr/', registerNo])
  }

  resetForm(){

  }
}

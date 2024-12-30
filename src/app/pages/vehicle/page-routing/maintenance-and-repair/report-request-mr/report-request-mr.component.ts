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
    this.form  = this.fb.group({
      status : null,
      txtSearch: null,
      rangeDate: null
    })

    this.search()
    this.getManufactureYears()
    this.getManufacture()
  }

  listManufactureYears : any[] =[]
  getManufactureYears(){
    this.vehicleServices.getManufactureYears().subscribe((response: any)=>{
      this.listManufactureYears = response.data
    })
  }

  listManufacture : any[] =[]
  getManufacture(){
    this.vehicleServices.getManufacturers().subscribe((response: any)=>{
      this.listManufacture = response.data
    })
  }

  search(){

  }

  dataLMRC : any[] = []
  showEmpolyeeNoData(){
    const numberData = 4
    const data = {id: null, name: null, yearOfBirth: null, phoneNumber: null, officeName: null, branchName: null, departmentName: null, positionName: null}
    
    const dataRrows = this.dataLMRC.slice();
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

  routerDetail(id: any){
    this.routes.navigate(['/vehicle/detail-mr/', id])
  }

  resetForm(){

  }
}

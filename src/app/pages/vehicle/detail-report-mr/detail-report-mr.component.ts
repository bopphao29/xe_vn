import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { VehicalServiceService } from '../../../shared/services/vehical-service.service';

@Component({
  selector: 'app-detail-report-mr',
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
        NzDatePickerModule,
        NzUploadModule,
        NzIconModule,
        NzRadioModule,
        NzModalModule,
        NzPaginationModule
  ],
  templateUrl: './detail-report-mr.component.html',
  styleUrl: './detail-report-mr.component.scss'
})
export class DetailReportMrComponent implements OnInit{


  constructor(
      private routes: Router,
      private vehicleServices : VehicalServiceService,
      private route: ActivatedRoute,
      
  ){}

  regisNo : any
  ngOnInit(): void {
    this.route.params.subscribe((params : any)=>{
      const regisNo = params['id']
      this.regisNo = regisNo
      this.getDetail(regisNo)
      this.dataSummaryByRegisterNo(regisNo)
    })
  }

  onBack(event: Event){
    this.routes.navigate(['/vehicle/maintenance-repair?tab=report-request'])

  }

  pageIndex = 1
  pageSize = 12
  total = -1
  inforMR : any
  listSM : any[]= []

  routerDetail(id: any){

  }

  onPageChange(page: number, regisNo: any): void {
    this.pageIndex = page;
    // this.search()
    this.getDetail(regisNo)
  }

  showEmpolyeeNoData(){
    const numberData = 12
    const data = {id: null, name: null, yearOfBirth: null, phoneNumber: null, officeName: null, branchName: null, punishmentForm: null, lastModifiedDate: null}
    
    const dataRrows = this.listSM.slice();
    const currentData = dataRrows.length
    if(currentData < numberData){
      const isChangeData = numberData - currentData
      for(let i = 0; i < isChangeData; i++){
        dataRrows.push(data)
      }
    }
    return dataRrows;
  }

  getDetail(regisNo: any){
    this.vehicleServices.summaryDetail(this.pageIndex - 1, this.pageSize, regisNo).subscribe((response: any)=>{
            this.listSM = response.data.content
            this.total = response.data.totalElements
            // console.log(this.total)
            // if(response.data.totalElements == 0){
            //   Swal.fire({
            //     icon: "warning",
            //     text: "Không tìm thấy dữ liệu bạn muốn tìm kiếm!",
            //   });
            // }
          })
  }
 
  dataSummaryByRegisterNo : any
  summaryByRegisterNo(regisNo: any){
    this.vehicleServices.summaryByRegisterNo(regisNo).subscribe((response: any)=>{
      this.dataSummaryByRegisterNo = response.data
    })
  }
}

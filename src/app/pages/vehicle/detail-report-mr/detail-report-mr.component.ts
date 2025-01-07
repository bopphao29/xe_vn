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
import { DialogService } from '../../../shared/services/dialog.service';
import { ChildReportComponent } from './report-mr-child/child-report/child-report.component';

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
      private router: Router,
      private vehicleServices : VehicalServiceService,
      private route: ActivatedRoute,
      private dialog: DialogService
      
  ){}

  regisNo : any
  ngOnInit(): void {
    this.route.params.subscribe((params : any)=>{
      const regisNo = params['id']
      this.regisNo = regisNo
      
    })

    this.getDetail(this.regisNo)
    this.summaryByRegisterNo(this.regisNo)
  }

  onBack(event: any) {
    const router = localStorage.getItem('activeLink');
    if (router === 'maintenanceRepair') {
      // event.preventDefault();
      localStorage.setItem('activeLink', 'maintenanceRepair'); // Cập nhật đúng giá trị
      this.router.navigate(['vehicle', 'maintenance-repair'], {
        queryParams: { tab: 'report-request' }, // Điều hướng tới `list-request`
      });
    }
  }
  pageIndex = 1
  pageSize = 12
  total = -1
  inforMR : any
  listSM : any[]= []

  detailChild : any
  routerDetail(id: any){
    console.log(id)
    this.vehicleServices.getDetailMR(id,1).subscribe((response : any) =>{
      this.detailChild = response.data 
      const dialogRef = this.dialog.openDialog(
        ChildReportComponent,
        '',
        this.detailChild,
        {
          nzWidth: '100vh',
        }
      )

    })

  }

  onPageChange(page: number, regisNo: any): void {
    this.pageIndex = page;
    // this.search()
    this.getDetail(regisNo)
  }
  
  showEmpolyeeNoData() {
    const numberData = 12;
    const emptyDetail = { date: '-', vehicleStatuses: null, hours: '-', worksPerformed: '-', id: null };
    
    // Tạo danh sách nhóm với dữ liệu ban đầu
    const dataGroups = this.listSM.map((item) => {
      const details = item.lstDetails || [];
      return {
        month: item.month,
        numberOfMaintenance: item.numberOfMaintenance,
        lstDetails: details.length ? details : [emptyDetail], // Ít nhất có một chi tiết trống
      };
    });
  
    // Tính tổng số hàng hiện tại
    const currentRowCount = dataGroups.reduce((sum, group) => sum + group.lstDetails.length, 0);
  
    // Nếu số hàng hiện tại ít hơn 12, thêm các hàng trống
    if (currentRowCount < numberData) {
      const rowsToAdd = numberData - currentRowCount;
      for (let i = 0; i < rowsToAdd; i++) {
        dataGroups.push({
          month: '-',
          numberOfMaintenance: '-',
          lstDetails: [emptyDetail],
        });
      }
    }
  
    return dataGroups;
  }
  
  

  getDetail(regisNo: any){
    this.vehicleServices.summaryDetail(this.pageIndex - 1, this.pageSize, regisNo).subscribe((response: any)=>{
            this.listSM = response.data.content
            this.total = response.data.totalElements
           
          })
  }
 
  dataSummaryByRegisterNo : any
  summaryByRegisterNo(regisNo: any){
    this.vehicleServices.summaryByRegisterNo(regisNo).subscribe((response: any)=>{
      this.dataSummaryByRegisterNo = response.data
    })
  }
}

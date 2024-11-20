import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { IData } from '../../../models/setup-profile-car/models-employee/setup-profile-employee/index.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserServiceService } from '../../../shared/services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import {PDF} from '../../../shared/pdf/pdf.util';

@Component({
  selector: 'app-detail-employee-violate',
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
  ],
  templateUrl: './detail-employee-violate.component.html',
  styleUrl: './detail-employee-violate.component.scss'
})
export class DetailEmployeeViolateComponent implements OnInit{
  
  constructor(
    private routes: Router,
    private userServices: UserServiceService,
    private route: ActivatedRoute,
    private notification: NotificationService
  ){
  }

  ngOnInit(){

    this.route.params.subscribe((params : any)=>{
      const id = params['id']
      this.getDetail(id)
    })
  }

  onBack(event: Event){
    event.preventDefault();
    this.routes.navigate(['/employee/list-employee-violates-discipline'])
  }

  inforEmployee: any
  inforCouncils : any
  getDetail(id: any){
    this.userServices.getDetailEmployeeViolate(id).subscribe((response: any)=>{
      this.inforEmployee = response.data
      this.inforCouncils = response.data.councils
    })
  }

  nameOfPDF(): string {
    const now = new Date()
    const date = now.toLocaleDateString('vi-VN', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/\//g, '_');
    return `Thongtinnhanvienvipham-${date}`
  }

  pdfExport(){
    this.userServices.exportPDFInToVioLet(this.inforEmployee).subscribe((response : any) => {
      const base64 = response.data
      console.log(base64)
      const blob = PDF.base64ToBlob(base64, 'application/pdf')
      // const blob = this.base64ToBlob(base64, 'application/pdf')
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.nameOfPDF()}.pdf`
      a.click();
      this.notification.success('Xuất file thành công!')
      // Dọn dẹp bộ nhớ
      window.URL.revokeObjectURL(url);
    })
  }
}

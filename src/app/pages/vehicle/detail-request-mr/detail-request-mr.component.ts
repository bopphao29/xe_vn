import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { VehicalServiceService } from '../../../shared/services/vehical-service.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-detail-request-mr',
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
    NzPaginationModule,
  ],
  templateUrl: './detail-request-mr.component.html',
  styleUrl: './detail-request-mr.component.scss',
})
export class DetailRequestMrComponent implements OnInit {
  isValidDate: boolean = true;

  constructor(
    private router: Router,
    private vehicleServices: VehicalServiceService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private notification: NotificationService
  ) {}

  id: any;

  form!: FormGroup;
  formUnApprove!: FormGroup;
  reason: string = '';
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      console.log(this.id);
      this.getDetailMR(this.id);
    });

    this.form = this.fb.group({
      vehicleStatusNote: '',
      testItemNote: '',
      workPerformedNote: '',
      replacementSupplyNote: '',
    });

    // this.isValidDate = this.checkValidDate();
  }

  checkValidDate() {
    if (
      !this.inforMR?.supposedStartDate ||
      !this.inforMR?.supposedEndDate ||
      !this.inforMR?.supposedStartTime ||
      !this.inforMR?.supposedEndTime
    ) {
      return false;
    }

    const startDateTime = new Date(this.inforMR.supposedStartDate);
    const endDateTime = new Date(this.inforMR.supposedEndDate);

    const [startHours, startMinutes] = this.inforMR.supposedStartTime
      .split(':')
      .map(Number);
    const [endHours, endMinutes] = this.inforMR.supposedEndTime
      .split(':')
      .map(Number);

    startDateTime.setHours(startHours, startMinutes);
    endDateTime.setHours(endHours, endMinutes);

    return startDateTime <= new Date() && new Date() <= endDateTime;
  }

  pdfExport() {}

  cancelUnApprove() {
    this.reason = '';
    this.unApprove = false;
  }

  isApproveCancel: boolean = false;
  hasSubmitUnApprove() {
    const dataForm = {
      type: 0,
      reason: this.reason,
      mrsId: Number(this.id),
    };

    this.vehicleServices.approvalMR(dataForm).subscribe({
      next: (response: any) => {
        this.unApprove = false;
        this.isApproveCancel = true;
      },
      error: (error: any) => {
        this.notification.error('Có lỗi xảy ra');
      },
    });
  }

  isApprove: boolean = false;
  isApproveDone: boolean = false;
  unApprove: boolean = false;
  isShareModal: boolean = false;
  isDeleteMR: boolean = false;

  onComplete() {
    this.router.navigate(['/vehicle/detail-mr-complete/' + this.id], {
      state: {
        isFromRequestMr: true,
      },
    });
  }

  selectAll(event: any) {
    // console.log(event)
  }

  selectItem(event: any, data: any) {
    // console.log(event)
  }

  isComplete: boolean = false;

  onAPT() {
    this.isComplete = true;
  }

  onUnApprove() {
    this.unApprove = true;
    this.cancelOpinion();
  }
  OnApprove() {
    this.isApprove = true;
  }

  onDelete() {
    this.isDeleteMR = true;
  }
  handleCancelApprove() {
    this.isApprove = false;
  }

  handleCancelApproveDone() {
    this.isApproveDone = false;
  }

  cancelApprove() {
    this.isApproveCancel = false;
  }

  onShare() {
    this.isShareModal = true;
  }
  cancelShareModal() {
    this.isShareModal = false;
  }

  cancelDeleteMR() {
    this.isDeleteMR = false;
  }

  handleSubmitDeleteMR() {
    this.vehicleServices.deleteMR(this.id).subscribe({
      next: (response: any) => {
        this.isDeleteMR = false;
        this.notification.success('Xóa thành công!');
      },
      error: (error: any) => {
        this.notification.error('Có lỗi xảy ra');
      },
    });
  }
  handleSubmitApprove() {
    const dataForm = {
      type: 1,
      mrsId: Number(this.id),
    };
    this.vehicleServices.approvalMR(dataForm).subscribe({
      next: (response: any) => {
        this.isApprove = false;
        this.isApproveDone = true;
      },
      error: (error: any) => {
        this.notification.error('Có lỗi xảy ra');
      },
    });
  }

  hasOpinion: boolean = false;
  onOpinion() {
    this.hasOpinion = true;
    this.cancelUnApprove();
  }

  hasSubmitOpinion() {
    const dataForm = {
      id: this.id,
      ...this.form.value,
    };

    this.vehicleServices.maintenanceNote(dataForm).subscribe({
      next: (response) => {
        this.notification.success('Thêm ý kiến thành công!');
        this.hasOpinion = false;
        this.form.reset();
        this.getDetailMR(this.id);
        // window.location.reload()
        // this.getUser(this.idEmployee)
      },
      error: (error) => {},
    });
  }

  cancelOpinion() {
    this.hasOpinion = false;
    this.form.reset();
  }

  inforMR: any;

  onBack(event: any) {
    const router = localStorage.getItem('activeLink');
    if (router === 'maintenanceRepair') {
      // event.preventDefault();
      localStorage.setItem('activeLink', 'maintenanceRepair'); // Cập nhật đúng giá trị
      this.router.navigate(['vehicle', 'maintenance-repair'], {
        queryParams: { tab: 'list-request' }, // Điều hướng tới `list-request`
      });
    }
  }

  getDetailMR(id: number) {
    this.vehicleServices.getDetailMR(id).subscribe((response: any) => {
      this.inforMR = response.data;
    });
  }

  onFix() {
    this.router.navigate(['/vehicle/detail-mr-change/' + this.id]);
  }
}

import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ValidateIntoPageService } from '../../../../shared/services/validate-into-page.service';
import { CommonModule } from '@angular/common';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogService } from '../../../../shared/services/dialog.service';
import { SetupOperationPopupDetailComponent } from './popup-detail/popup-detail.component';

@Component({
  selector: 'app-setup-operation-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss'],
  standalone: true,
  imports: [
    NzSelectModule,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    NzToolTipModule,
    NzTableModule,
    NzPaginationModule,
  ],
})
export class SetupOperationRouteComponent implements OnInit {
  listGender = [
    { id: 1, value: 'Nam' },
    { id: 2, value: 'Nữ' },
  ];

  showEmpolyeeNoData: any = [];

  pageIndex = 1;
  pageSize = 12;
  total = 0;

  pagedData: any[] = [];

  listFake = [1];

  form!: FormGroup;

  constructor(
    private validateService: ValidateIntoPageService,
    private fb: FormBuilder,
    private dialogSrv: DialogService
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.search();
  }

  loadForm() {
    this.form = this.fb.group({
      routeType: [null],
      routeName: [''],
      startPoint: [''],
      totalDistance: [''],
      completionTime: [''],
      endPoint: [''],
      runningTime: [''],
      distance: [''],
      shortestRoute: [''],
      ticketPrice: [''],
      stopPoints: this.fb.array(
        this.listFake.map(() => this.createStopPoint())
      ),
    });
  }

  createStopPoint(): FormGroup {
    return this.fb.group({
      stopName: [''],
      runningTime: [''],
      waitingTime: [''],
      distance: [''],
      shortestRoute: [''],
    });
  }

  get stopPoints(): FormArray {
    return this.form.get('stopPoints') as FormArray;
  }

  onSubmit() {
    console.log(this.form.value);
  }

  validateText(path: string | (string | number)[], event: Event) {
    // this.validateService.validateText(this.form, path, event)
  }

  viewDetail(data: any) {
    const dialogData = {
      title: 'Chi tiết lộ trình',
    };

    const dialogRef = this.dialogSrv.openDialog(
      SetupOperationPopupDetailComponent,
      'Chi tiết lộ trình',
      dialogData,
      {
        nzClosable: true,
        nzWidth: '1152px',
        nzCentered: true,
        nzClassName: 'custom-modal',
      }
    );

    dialogRef.afterClose.subscribe((result: any) => {
      if (result) {
        console.log(result);
      }
    });
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.search();
  }

  search() {
    this.showEmpolyeeNoData = [
      {
        code: 'EMP001',
        name: 'Nguyễn Văn A',
        yearOfBirth: '1990',
        phoneNumber: '0123456789',
        officeName: 'Văn phòng Hà Nội',
        branchName: 'Chi nhánh miền Bắc',
        departmentName: 'Phòng kinh doanh',
        positionName: 'Trưởng phòng',
        id: 1,
      },
      {
        code: 'EMP002',
        name: 'Trần Thị B',
        yearOfBirth: '1992',
        phoneNumber: '0987654321',
        officeName: 'Văn phòng Đà Nẵng',
        branchName: 'Chi nhánh miền Trung',
        departmentName: 'Phòng hành chính',
        positionName: 'Nhân viên',
        id: 2,
      },
      {
        code: 'EMP003',
        name: 'Lê Văn C',
        yearOfBirth: '1988',
        phoneNumber: '0912345678',
        officeName: 'Văn phòng Hồ Chí Minh',
        branchName: 'Chi nhánh miền Nam',
        departmentName: 'Phòng kỹ thuật',
        positionName: 'Nhân viên',
        id: 3,
      },
      {
        code: 'EMP004',
        name: 'Phạm Thị D',
        yearOfBirth: '1995',
        phoneNumber: '0945678910',
        officeName: 'Văn phòng Hà Nội',
        branchName: 'Chi nhánh miền Bắc',
        departmentName: 'Phòng tài chính',
        positionName: 'Kế toán trưởng',
        id: 4,
      },
      {
        code: 'EMP005',
        name: 'Vũ Văn E',
        yearOfBirth: '1993',
        phoneNumber: '0934567890',
        officeName: 'Văn phòng Hồ Chí Minh',
        branchName: 'Chi nhánh miền Nam',
        departmentName: 'Phòng nhân sự',
        positionName: 'Trưởng nhóm',
        id: 5,
      },
    ];
  }

  addFormArray() {
    this.stopPoints.push(this.createStopPoint());
  }

  removeFormArray(index: number) {
    this.stopPoints.removeAt(index);
  }
}

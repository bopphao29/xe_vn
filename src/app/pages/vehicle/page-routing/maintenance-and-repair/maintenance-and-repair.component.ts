import { Component, OnInit } from '@angular/core';
import { ReportRequestMrComponent } from './report-request-mr/report-request-mr.component';
import { ListRequestMrComponent } from './list-request-mr/list-request-mr.component';
import { SetupRequestMrComponent } from './setup-request-mr/setup-request-mr.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-maintenance-and-repair',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReportRequestMrComponent,
    ListRequestMrComponent,
    TranslateModule,
    ReactiveFormsModule,
    SetupRequestMrComponent
  ],
  templateUrl: './maintenance-and-repair.component.html',
  styleUrl: './maintenance-and-repair.component.scss'
})
export class MaintenanceAndRepairComponent implements OnInit{
  data = 'aaaa'

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ){

  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.currentTab = params['tab'];
      } else {
        this.updateURL(this.currentTab); // Đảm bảo URL đồng bộ nếu không có tab
      }
    })
  }

  currentTab: string = 'setup-request'; // Tab mặc định

  changeTab(tab: string) {
    this.currentTab = tab;
    this.updateURL(tab); // Cập nhật URL mỗi khi tab thay đổi
  }

  updateURL(tab: string) {
    this.router.navigate([], {
      relativeTo: this.route, // Dựa trên route hiện tại
      queryParams: { tab: tab },
      queryParamsHandling: 'merge', // Giữ các queryParams khác nếu có
    });
  }
}

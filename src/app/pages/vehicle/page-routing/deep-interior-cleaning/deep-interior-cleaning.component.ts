import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportDeepCleaningComponent } from './page/report-deep-cleaning/report-deep-cleaning.component';
import { SetupDeepCleaningComponent } from './page/setup-deep-cleaning/setup-deep-cleaning.component';
import { ListDeepCleaningComponent } from './page/list-deep-cleaning/list-deep-cleaning.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-deep-interior-cleaning',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReportDeepCleaningComponent,
    SetupDeepCleaningComponent,
    ListDeepCleaningComponent,
    TranslateModule
  ],
  templateUrl: './deep-interior-cleaning.component.html',
  styleUrl: './deep-interior-cleaning.component.scss'
})
export class DeepInteriorCleaningComponent implements OnInit{

  data = ''
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

  currentTab: string = 'setupDCL'; // Tab mặc định

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

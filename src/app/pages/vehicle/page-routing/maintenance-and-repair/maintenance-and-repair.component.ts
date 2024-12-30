import { Component } from '@angular/core';
import { ReportRequestMrComponent } from './report-request-mr/report-request-mr.component';
import { ListRequestMrComponent } from './list-request-mr/list-request-mr.component';
import { SetupRequestMrComponent } from './setup-request-mr/setup-request-mr.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
export class MaintenanceAndRepairComponent {
  data = 'aaaa'

  receiveRouterLink(name: string){

  }
  currentTab: string = 'setup-request'; // Tab mặc định

  switchTab(tab: string) {
    this.currentTab = tab; // Chuyển tab
  }
}

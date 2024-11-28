import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-report-request-mr',
  standalone: true,
  imports: [],
  templateUrl: './report-request-mr.component.html',
  styleUrl: './report-request-mr.component.scss'
})
export class ReportRequestMrComponent {
  @Input() data = ''

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      // this.getAdminAccountInfo(this.data.adminAccountId);
      console.log(this.data);
      
    }
  }
}

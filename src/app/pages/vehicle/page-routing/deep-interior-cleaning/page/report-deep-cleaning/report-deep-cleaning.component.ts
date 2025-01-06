import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-deep-cleaning',
  standalone: true,
  imports: [],
  templateUrl: './report-deep-cleaning.component.html',
  styleUrl: './report-deep-cleaning.component.scss'
})
export class ReportDeepCleaningComponent implements OnInit{
    @Input() data = ''
  
    ngOnInit(): void {
      
    }
}

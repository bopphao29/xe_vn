import { Component, OnInit } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NzTabsModule,
]
})
export class HomeComponent implements OnInit {
  activeTab: number = 1;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() { }

}

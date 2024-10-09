import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {TranslateModule, TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './home-default.component.html',
  styleUrls: ['./home-default.component.scss'],
  imports: [
    NzButtonModule,
    TranslateModule
  ]
})
export class HomeDefaultComponent implements OnInit {

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {

  }

  handleChange() {
    const language = localStorage.getItem('__language') || 'vi';
    if ( language === 'vi') {
      localStorage.setItem('__language', 'en');
    } else {
      localStorage.setItem('__language', 'vi');
    }
    this.translate.use(language);
    window.location.reload();
  }
}

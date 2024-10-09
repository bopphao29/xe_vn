import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [
    TranslateModule
  ]
})
export class FooterComponent {

  constructor(
    private translate: TranslateService
  ) { }
}

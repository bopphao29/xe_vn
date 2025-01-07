import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-popup-update-fuel-price',
  templateUrl: './popup-update.component.html',
  styleUrls: ['./popup-update.component.scss'],
  standalone: true,
  imports: [
    NzModalModule,
    NzTimePickerModule,
    NzDatePickerModule,
    TranslateModule,
    ButtonComponent,
  ],
})
export class PopupUpdateFuelPriceComponent {
  constructor(@Inject(NZ_MODAL_DATA) public modalData: any) {}
}

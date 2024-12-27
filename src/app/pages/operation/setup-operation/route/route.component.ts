import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ValidateIntoPageService } from '../../../../shared/services/validate-into-page.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-setup-operation-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss'],
  standalone: true,
  imports: [NzSelectModule, TranslateModule, CommonModule],
})
export class SetupOperationRouteComponent {
  listGender = [
    { id: 1, value: 'Nam' },
    { id: 2, value: 'Nữ' },
  ];

  constructor(private validateService: ValidateIntoPageService) {}

  onSubmit() {}

  validateText(path: string | (string | number)[], event: Event) {
    // this.validateService.validateText(this.form, path, event)
  }
}

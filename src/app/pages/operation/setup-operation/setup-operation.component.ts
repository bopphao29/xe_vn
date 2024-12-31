import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-setup-operation',
  templateUrl: './setup-operation.component.html',
  styleUrls: ['./setup-operation.component.scss'],
  standalone: true,
  imports: [TranslateModule, RouterLink, RouterModule],
})
export class SetupOperationComponent {
  constructor() {}
}

import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicle-command',
  templateUrl: './vehicle-command.component.html',
  styleUrls: ['./vehicle-command.component.scss'],
  standalone: true,
  imports: [TranslateModule, RouterLink, RouterModule],
})
export class VehicleCommandComponent {
  constructor() {}
}

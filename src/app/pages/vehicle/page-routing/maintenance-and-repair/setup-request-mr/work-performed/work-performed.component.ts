import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-work-performed',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    TranslateModule
  ],
  templateUrl: './work-performed.component.html',
  styleUrl: './work-performed.component.scss'
})
export class WorkPerformedComponent {

}

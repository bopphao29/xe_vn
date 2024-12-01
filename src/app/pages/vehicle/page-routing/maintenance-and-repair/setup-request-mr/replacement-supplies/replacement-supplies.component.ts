import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-replacement-supplies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    TranslateModule
  ],
  templateUrl: './replacement-supplies.component.html',
  styleUrl: './replacement-supplies.component.scss'
})
export class ReplacementSuppliesComponent {

}

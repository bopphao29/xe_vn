import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ModalVehicalComponent } from '../../../../../../shared/modals/modal-vehical/modal-vehical.component';
import { DialogService } from '../../../../../../shared/services/dialog.service';

@Component({
  selector: 'app-car-status',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    TranslateModule
  ],
  templateUrl: './car-status.component.html',
  styleUrl: './car-status.component.scss'
})
export class CarStatusComponent {
  constructor(
    private dialogService: DialogService
  ){

  }

  openDialog(){
    this.dialogService.openDialog(ModalVehicalComponent, 'Xác nhận xóa',{
      message: 'Bạn có chắc chắn muốn xóa mục này?'
    },
    {
      nzClassName: 'custom-dialog'
    })
  }


}

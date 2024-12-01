import { Component, Input } from '@angular/core';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-vehical',
  standalone: true,
  imports: [],
  templateUrl: './modal-vehical.component.html',
  styleUrl: './modal-vehical.component.scss'
})
export class ModalVehicalComponent {
  @Input() title: string = 'Thông báo';
  @Input() message: string = 'Nội dung mặc định';

  constructor(private modalRef: NzModalRef) {}

  close(): void {
    this.modalRef.close();
  }
}

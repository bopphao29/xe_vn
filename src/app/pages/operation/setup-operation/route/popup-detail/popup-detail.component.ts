import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-setup-operation-popup-detail',
  templateUrl: './popup-detail.component.html',
  styleUrls: ['./popup-detail.component.scss'],
  standalone: true,
  imports: [
    NzSelectModule,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    NzToolTipModule,
    NzTableModule,
    NzPaginationModule,
  ],
})
export class SetupOperationPopupDetailComponent implements OnInit {
  form!: FormGroup;

  listFake = [1];

  isEdit: boolean = false;

  constructor(private fb: FormBuilder, private modal: NzModalRef) {}

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.form = this.fb.group({
      routeName: [''],
      startPoint: [''],
      totalDistance: [''],
      completionTime: [''],
      endPoint: [''],
      runningTime: [''],
      distance: [''],
      shortestRoute: [''],
      ticketPrice: [''],
      stopPoints: this.fb.array(
        this.listFake.map(() => this.createStopPoint())
      ),
    });
  }

  createStopPoint(): FormGroup {
    return this.fb.group({
      stopName: [''],
      runningTime: [''],
      waitingTime: [''],
      distance: [''],
      shortestRoute: [''],
    });
  }

  get stopPoints(): FormArray {
    return this.form.get('stopPoints') as FormArray;
  }

  validateText(path: string | (string | number)[], event: Event) {
    // this.validateService.validateText(this.form, path, event)
  }

  closeModal() {
    this.modal.close();
  }

  saveEdit() {}

  addFormArray() {
    this.stopPoints.push(this.createStopPoint());
  }

  removeFormArray(index: number) {
    this.stopPoints.removeAt(index);
  }
}

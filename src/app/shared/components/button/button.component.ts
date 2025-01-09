import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ButtonComponent implements OnChanges {
  @Input() title!: string;
  @Input() icon!: string;
  @Input() isDelete: boolean = false;
  @Output() click = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      console.log(changes);
    }
  }

  onClick() {
    this.click.emit();
  }
}

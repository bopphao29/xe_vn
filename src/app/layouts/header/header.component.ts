import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import {
  BreadcrumService,
  IBreadcrumb,
} from '../../shared/services/breadcrum.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { clearStore } from '../../shared/utilities/system.utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NzBreadCrumbModule,
    NzAvatarModule,
    NzDropDownModule,
    TranslateModule,
    NzLayoutModule,
    RouterModule,
    NzIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(private router: Router) {
  }

  logout() {
    clearStore();
    this.router.navigateByUrl('/login');
  }
}

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { SidebarModel } from '../../shared/models/sidebar.model';
import { SIDE_MENU } from '../../shared/constants/sidebar.const';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule,
    NzMenuModule,
    NzLayoutModule
  ]
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @Input() isCollapsed!: boolean;
  menus: SidebarModel[] = SIDE_MENU;
  urls!: string;
  constructor(
    private translate: TranslateService,
    private router: Router
  ) { }
    ngOnInit(): void {
        this.urls = this.router.url.split('/')[1];
        this.openHandler(this.urls);
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.urls = this.router.url.split('/')[1];
        })
    }

    openHandler(value: string) {
        this.menus = this.menus.map(menu => menu.router === value ? {...menu, open: true} : menu);
    }
}

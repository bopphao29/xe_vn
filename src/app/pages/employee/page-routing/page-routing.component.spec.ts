import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRoutingComponent } from './page-routing.component';

describe('PageRoutingComponent', () => {
  let component: PageRoutingComponent;
  let fixture: ComponentFixture<PageRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageRoutingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

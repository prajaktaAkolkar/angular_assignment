import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatReactiveComponent } from './mat-reactive.component';

describe('MatReactiveComponent', () => {
  let component: MatReactiveComponent;
  let fixture: ComponentFixture<MatReactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatReactiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatReactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTemplateComponent } from './mat-template.component';

describe('MatTemplateComponent', () => {
  let component: MatTemplateComponent;
  let fixture: ComponentFixture<MatTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

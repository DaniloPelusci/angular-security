import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsCrudComponent } from './leads-crud.component';

describe('LeadsCrudComponent', () => {
  let component: LeadsCrudComponent;
  let fixture: ComponentFixture<LeadsCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

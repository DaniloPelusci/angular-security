import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadReadComponent } from './lead-read.component';

describe('LeadReadComponent', () => {
  let component: LeadReadComponent;
  let fixture: ComponentFixture<LeadReadComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});

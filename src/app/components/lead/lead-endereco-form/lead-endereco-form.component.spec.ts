import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadEnderecoFormComponent } from './lead-endereco-form.component';

describe('LeadEnderecoFormComponent', () => {
  let component: LeadEnderecoFormComponent;
  let fixture: ComponentFixture<LeadEnderecoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadEnderecoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadEnderecoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

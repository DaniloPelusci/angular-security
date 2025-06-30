import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadEnderecoComponent } from './lead-endereco.component';

describe('LeadEnderecoComponent', () => {
  let component: LeadEnderecoComponent;
  let fixture: ComponentFixture<LeadEnderecoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadEnderecoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadEnderecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

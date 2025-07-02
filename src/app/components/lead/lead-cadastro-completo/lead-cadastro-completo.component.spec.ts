import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadCadastroCompletoComponent } from './lead-cadastro-completo.component';

describe('LeadCadastroCompletoComponent', () => {
  let component: LeadCadastroCompletoComponent;
  let fixture: ComponentFixture<LeadCadastroCompletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadCadastroCompletoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadCadastroCompletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

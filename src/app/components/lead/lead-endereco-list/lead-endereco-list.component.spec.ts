import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadEnderecoListComponent } from './lead-endereco-list.component';

describe('LeadEnderecoListComponent', () => {
  let component: LeadEnderecoListComponent;
  let fixture: ComponentFixture<LeadEnderecoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadEnderecoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadEnderecoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

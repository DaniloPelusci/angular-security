import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarDocumentoComponent } from './solicitar-documento.component';

describe('SolicitarDocumentoComponent', () => {
  let component: SolicitarDocumentoComponent;
  let fixture: ComponentFixture<SolicitarDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarDocumentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

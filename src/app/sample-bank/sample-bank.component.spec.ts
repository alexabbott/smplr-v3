import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleBankComponent } from './sample-bank.component';

describe('SampleBankComponent', () => {
  let component: SampleBankComponent;
  let fixture: ComponentFixture<SampleBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

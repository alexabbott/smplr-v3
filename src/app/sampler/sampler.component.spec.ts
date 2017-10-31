import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplerComponent } from './sampler.component';

describe('SamplerComponent', () => {
  let component: SamplerComponent;
  let fixture: ComponentFixture<SamplerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

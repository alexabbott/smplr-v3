import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KitsComponent } from './kits.component';

describe('KitsComponent', () => {
  let component: KitsComponent;
  let fixture: ComponentFixture<KitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitComponent } from './kit.component';

describe('KitComponent', () => {
  let component: KitComponent;
  let fixture: ComponentFixture<KitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KitComponent]
    });
    fixture = TestBed.createComponent(KitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

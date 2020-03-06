import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KitPreviewComponent } from './kit-preview.component';

describe('KitPreviewComponent', () => {
  let component: KitPreviewComponent;
  let fixture: ComponentFixture<KitPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KitPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

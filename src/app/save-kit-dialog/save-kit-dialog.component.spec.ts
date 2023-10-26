import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveKitDialogComponent } from './save-kit-dialog.component';

describe('SaveKitDialogComponent', () => {
  let component: SaveKitDialogComponent;
  let fixture: ComponentFixture<SaveKitDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveKitDialogComponent]
    });
    fixture = TestBed.createComponent(SaveKitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

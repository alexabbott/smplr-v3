import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveSequenceDialogComponent } from './save-sequence-dialog.component';

describe('SaveSequenceDialogComponent', () => {
  let component: SaveSequenceDialogComponent;
  let fixture: ComponentFixture<SaveSequenceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveSequenceDialogComponent]
    });
    fixture = TestBed.createComponent(SaveSequenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

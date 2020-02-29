import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveSequenceDialogComponent } from './save-sequence-dialog.component';

describe('SaveSequenceDialogComponent', () => {
  let component: SaveSequenceDialogComponent;
  let fixture: ComponentFixture<SaveSequenceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveSequenceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveSequenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

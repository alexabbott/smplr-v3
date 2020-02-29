import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveSampleDialogComponent } from './save-sample-dialog.component';

describe('SaveSampleDialogComponent', () => {
  let component: SaveSampleDialogComponent;
  let fixture: ComponentFixture<SaveSampleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveSampleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveSampleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

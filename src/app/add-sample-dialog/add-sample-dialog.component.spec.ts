import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSampleDialogComponent } from './add-sample-dialog.component';

describe('AddSampleDialogComponent', () => {
  let component: AddSampleDialogComponent;
  let fixture: ComponentFixture<AddSampleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSampleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSampleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatSidenavModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatOptionModule } from '@angular/material';
import 'hammerjs';
import { FormsModule } from '@angular/forms';
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { DndModule } from 'ng2-dnd';

import { AppComponent } from './app.component';
import { SamplerComponent } from './sampler/sampler.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SampleBankComponent } from './sample-bank/sample-bank.component';
import { AddSampleDialogComponent } from './add-sample-dialog/add-sample-dialog.component';

import { GlobalService } from './global.service';
import { SearchPipe } from './search.pipe';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    SamplerComponent,
    SidenavComponent,
    SampleBankComponent,
    AddSampleDialogComponent,
    SearchPipe
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    DndModule.forRoot()
  ],
  providers: [GlobalService],
  entryComponents: [AddSampleDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

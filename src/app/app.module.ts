import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { KitComponent } from './kit/kit.component';

import { GlobalService } from '../app/global.service';
import { SequencerService } from '../app/sequencer.service';

import { DndModule } from 'ng2-dnd';
import { SampleComponent } from './sample/sample.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { SamplesComponent } from './samples/samples.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ProfileComponent } from './profile/profile.component';
import { SequencerComponent } from './sequencer/sequencer.component';
import { KitsComponent } from './kits/kits.component';
import { SaveSampleDialogComponent } from './save-sample-dialog/save-sample-dialog.component';
import { SaveKitDialogComponent } from './save-kit-dialog/save-kit-dialog.component';
import { SaveSequenceDialogComponent } from './save-sequence-dialog/save-sequence-dialog.component';
import { KitPreviewComponent } from './kit-preview/kit-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    KitComponent,
    SampleComponent,
    FavoriteComponent,
    SamplesComponent,
    SidenavComponent,
    ProfileComponent,
    SequencerComponent,
    KitsComponent,
    SaveSampleDialogComponent,
    SaveKitDialogComponent,
    SaveSequenceDialogComponent,
    KitPreviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    DndModule.forRoot(),
  ],
  providers: [GlobalService, SequencerService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop'
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
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SequencerComponent } from './sequencer/sequencer.component';
import { ProfileComponent } from './profile/profile.component';
import { SamplesComponent } from './samples/samples.component';
import { SaveSampleDialogComponent } from './save-sample-dialog/save-sample-dialog.component';
import { SampleComponent } from './sample/sample.component';
import { KitComponent } from './kit/kit.component';
import { KitsComponent } from './kits/kits.component';
import { KitPreviewComponent } from './kit-preview/kit-preview.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { SaveKitDialogComponent } from './save-kit-dialog/save-kit-dialog.component';
import { SaveSequenceDialogComponent } from './save-sequence-dialog/save-sequence-dialog.component';
import { EditProfileDialogComponent } from './edit-profile-dialog/edit-profile-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    SequencerComponent,
    ProfileComponent,
    SamplesComponent,
    SaveSampleDialogComponent,
    SampleComponent,
    KitComponent,
    KitsComponent,
    KitPreviewComponent,
    FavoriteComponent,
    SaveKitDialogComponent,
    SaveSequenceDialogComponent,
    EditProfileDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    DragDropModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

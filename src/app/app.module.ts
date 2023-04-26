import { NgModule, isDevMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';

import { KingComponent } from './components/pieces/king/king.component';
import { QueenComponent } from './components/pieces/queen/queen.component';
import { PawnComponent } from './components/pieces/pawn/pawn.component';
import { BishopComponent } from './components/pieces/bishop/bishop.component';
import { KnightComponent } from './components/pieces/knight/knight.component';
import { RookComponent } from './components/pieces/rook/rook.component';
import { PlayBoardComponent } from './components/play-board/play-board.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { MatTabsModule } from '@angular/material/tabs'

@NgModule({
  imports: [ 
    BrowserModule, 
    FormsModule, 
    HttpClientModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
    ],
  declarations: [ 
    AppComponent, 
    KingComponent,
    QueenComponent,
    PawnComponent,
    BishopComponent,
    KnightComponent,
    RookComponent,
    PlayBoardComponent,
    GameBoardComponent
  ],
  providers: [
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

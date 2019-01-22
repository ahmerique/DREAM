import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeadersComponent } from './headers/headers.component';
import { CoreComponent } from './core/core.component';
import { LearningComponent } from './learning/learning.component';
import { PredictionComponent } from './prediction/prediction.component';
import { InteractionGraphComponent } from './interaction-graph/interaction-graph.component';
import { ModelComponent } from './model/model.component';
import { CompteComponent } from './compte/compte.component';
import { DonneesComponent } from './donnees/donnees.component';
import { HistoriqueComponent } from './historique/historique.component';
import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeadersComponent,
    CoreComponent,
    LearningComponent,
    PredictionComponent,
    InteractionGraphComponent,
    ModelComponent,
    CompteComponent,
    DonneesComponent,
    HistoriqueComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

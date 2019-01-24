import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeadersComponent } from './headers/headers.component';
import { CoreComponent } from './core/core.component';
import { LearningComponent } from './learning/learning.component';
import { PredictionComponent } from './prediction/prediction.component';
import { InteractionGraphComponent } from './interaction-graph/interaction-graph.component';
import { ModelComponent } from './model/model.component';
import { AccountComponent } from './account/account.component';
import { DataComponent } from './data/data.component';
import { HistoryComponent } from './history/history.component';
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
    AccountComponent,
    DataComponent,
    HistoryComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

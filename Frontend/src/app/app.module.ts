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
<<<<<<< HEAD
import { HttpClientModule }    from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

=======
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
>>>>>>> 41e7ba9d02fc228a868f3904057b7b2634338867

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
    MainPageComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

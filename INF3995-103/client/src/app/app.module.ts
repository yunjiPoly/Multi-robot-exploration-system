import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from './modules/app-material.module';
import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { MissionHistoryComponent } from './pages/mission-history/mission-history.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ListMissionsComponent } from './components/list-missions/list-missions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RobotStateComponent } from './components/robot-state/robot-state.component';
import { MapComponent } from './components/map/map.component';
import { CommunicationService } from './services/communication.service';
import { LogDisplayComponent } from './components/log-display/log-display.component';
import { MissionPageComponent } from './pages/mission-page/mission-page.component';
import { MissionLaunchComponent } from './components/mission-launch/mission-launch.component';
import { SecurityZoneDialogComponent } from './components/security-zone-dialog/security-zone-dialog.component';
import { HeaderComponent } from './components/header/header.component';
import { PositionsDialogComponent } from './components/positions-dialog/positions-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RobotStateComponent,
    MapComponent,
    MissionHistoryComponent,
    HomePageComponent,
    ListMissionsComponent,
    LogDisplayComponent,
    MissionPageComponent,
    MissionLaunchComponent,
    SecurityZoneDialogComponent,
    HeaderComponent,
    PositionsDialogComponent
  ],
  imports: [
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatSlideToggleModule
  ],
  providers: [CommunicationService],
  bootstrap: [AppComponent]
})
export class AppModule {}

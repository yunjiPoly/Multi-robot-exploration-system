import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from '../pages/home-page/home-page.component';
import { MissionHistoryComponent } from '../pages/mission-history/mission-history.component';
import { MissionPageComponent } from '../pages/mission-page/mission-page.component';
const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'mission', component: MissionPageComponent },
  { path: 'missions-history', component: MissionHistoryComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

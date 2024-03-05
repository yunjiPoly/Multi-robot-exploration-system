import { Component, OnDestroy } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MissionService } from 'src/app/services/mission.service';
import { MatDialog } from '@angular/material/dialog';
import { PositionsDialogComponent } from '../positions-dialog/positions-dialog.component';

@Component({
  selector: 'app-mission-launch',
  templateUrl: './mission-launch.component.html',
  styleUrls: ['./mission-launch.component.scss']
})
export class MissionLaunchComponent implements OnDestroy {
  simToggle: boolean = false;
  private componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    public dialog: MatDialog,
    private missionService: MissionService,
    private communicationService: CommunicationService,
    private router: Router
  ) {
    this.communicationService.subscribeToStartMissionEvent(this.componentDestroyed$, () => {
      this.communicationService.pageReady(this.missionService.initialPositions);
      this.router.navigate(['/mission']);
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  startMission(): void {
    this.missionService.setSimStatus(this.simToggle);
    this.communicationService.start(this.simToggle);
  }

  openCreatePositionDialog(): void {
    const dialogRef = this.dialog.open(PositionsDialogComponent);
    dialogRef.afterClosed().subscribe((startingMission: boolean) => {
      if (startingMission) {
        this.startMission();
      }
    });
  }

  goToMissionPage(): void {
    this.router.navigate(['/mission']);
  }

  goToHistory(): void {
    this.router.navigate(['/missions-history']);
  }

  getIsMissionOngoing(): boolean {
    return this.missionService.getIsMissionOngoing();
  }
}

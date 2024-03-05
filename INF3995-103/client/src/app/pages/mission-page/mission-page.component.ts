import { ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LogDisplayComponent } from 'src/app/components/log-display/log-display.component';
import { MapComponent } from 'src/app/components/map/map.component';
import { PositionsDialogComponent } from 'src/app/components/positions-dialog/positions-dialog.component';
import { SecurityZoneDialogComponent } from 'src/app/components/security-zone-dialog/security-zone-dialog.component';
import { CommunicationService } from 'src/app/services/communication.service';
import { MissionService } from 'src/app/services/mission.service';
import { SecurityZoneService } from 'src/app/services/security-zone.service';
import SocketService from 'src/app/services/socket.service';
import { Robot } from 'src/app/classes/robot';

@Component({
  selector: 'app-mission-page',
  templateUrl: './mission-page.component.html',
  styleUrls: ['./mission-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MissionPageComponent implements OnDestroy {
  @ViewChild(LogDisplayComponent) logsComponent: LogDisplayComponent;
  @ViewChild(MapComponent) mapComponent: MapComponent;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly ROBOT_COLORS = ['darkgreen', 'indigo'];

  isSecurityZoneSet: boolean;
  simToggle: boolean = false;
  robots: Robot[] = [];
  private componentDestroyed$: Subject<boolean> = new Subject();
  private isSubscribedToReadyEvent: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private readonly missionService: MissionService,
    private readonly communicationService: CommunicationService,
    private readonly changeDetection: ChangeDetectorRef,
    private readonly securityZoneService: SecurityZoneService,
    private readonly socketService: SocketService
  ) {
    this.communicationService.getMissionStatus().subscribe((isMissionOngoing: boolean) => {
      if (!isMissionOngoing) {
        this.router.navigate(['/home']);
        this.missionService.resetMission();
      }
    });

    this.securityZoneService.subscribeToNewSecurityZoneStatusEvent(this.componentDestroyed$, (newStatus: boolean) => {
      this.isSecurityZoneSet = newStatus;
      this.changeDetection.detectChanges();
    });

    this.socketService.on('robotState', (robots: Robot[]) => {
      this.robots = robots;
      this.changeDetection.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  getIsMissionOngoing(): boolean {
    return this.missionService.getIsMissionOngoing();
  }

  getIsSim(): boolean {
    return this.missionService.getSimStatus() !== false;
  }

  startMission(): void {
    if (!this.isSubscribedToReadyEvent) {
      this.communicationService.subscribeToStartMissionEvent(this.componentDestroyed$, () => {
        this.communicationService.pageReady(this.missionService.initialPositions);
      });
      this.isSubscribedToReadyEvent = true;
    }

    this.resetMissionPage();
    this.missionService.setSimStatus(this.simToggle);
    this.communicationService.start(this.simToggle);
  }

  stopMission(): void {
    this.communicationService.stop(false);
  }

  returnToBase(): void {
    this.communicationService.stop(true);
  }

  openCreateSecurityZoneDialog(): void {
    this.dialog.open(SecurityZoneDialogComponent);
  }

  openCreatePositionDialog(): void {
    const dialogRef = this.dialog.open(PositionsDialogComponent);
    dialogRef.afterClosed().subscribe((startingMission: boolean) => {
      if (startingMission) {
        this.startMission();
      }
    });
  }

  deleteSecurityZone(): void {
    this.securityZoneService.deleteSecurityZone();
  }

  color(idx: number): string {
    return this.ROBOT_COLORS[idx % this.ROBOT_COLORS.length];
  }

  robotId(index: number, robot: Robot): string {
    return robot.id;
  }

  private resetMissionPage(): void {
    this.missionService.setClientReady();
    this.logsComponent.logs = [];
    this.mapComponent.ngOnDestroy();
  }
}

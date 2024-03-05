import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { CommunicationService } from './communication.service';
import { MissionType } from '../classes/mission';
import { Pose } from '../classes/position';

@Injectable({
  providedIn: 'root'
})
export class MissionService implements OnDestroy {
  initialPositions: Pose[] = [];
  private isSim: boolean | null = null;
  private isClientReady: boolean = false;
  private isMissionOngoing: boolean = false;

  private serviceDestroyed$: Subject<boolean> = new Subject();

  constructor(private communicationService: CommunicationService) {
    this.communicationService.getMissionStatus().subscribe((isMissionOngoing: boolean) => {
      this.isMissionOngoing = isMissionOngoing;
    });

    this.communicationService.getMissionType().subscribe((missionType: string | null) => {
      if (missionType === MissionType.Simulation) {
        this.isSim = true;
      } else if (missionType === MissionType.Real) {
        this.isSim = false;
      } else {
        this.isSim = null;
      }
    });

    this.communicationService.subscribeToStartMissionEvent(this.serviceDestroyed$, () => {
      this.isClientReady = true;
    });

    this.communicationService.subscribeToReadyEvent(this.serviceDestroyed$, () => {
      this.isMissionOngoing = true;
    });

    this.communicationService.subscribeToStopMissionEvent(this.serviceDestroyed$, () => {
      this.resetMission();
    });
    this.isMissionOngoing = true;
  }

  ngOnDestroy(): void {
    this.serviceDestroyed$.next(true);
    this.serviceDestroyed$.complete();
  }

  setSimStatus(newSimStatus: boolean): void {
    this.isSim = newSimStatus;
  }

  getSimStatus(): boolean | null {
    return this.isSim;
  }

  resetMission(): void {
    this.isMissionOngoing = false;
    this.isClientReady = false;
    this.isSim = null;
  }

  getIsMissionOngoing(): boolean {
    return this.isMissionOngoing;
  }

  getClientStatus(): boolean {
    return this.isClientReady;
  }

  setClientReady(): void {
    this.isClientReady = true;
  }
}

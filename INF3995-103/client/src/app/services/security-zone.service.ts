import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Dim } from '../classes/dim';
import { Position } from '../classes/position';
import { CommunicationService, SecurityZoneStatusResponse } from './communication.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityZoneService {
  private isSecurityZoneActivated: boolean = false;
  private zoneOrigin: Position | undefined = undefined;
  private zoneDimensions: Dim | undefined = undefined;
  private newSecurityZoneStatusEvent: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly communicationService: CommunicationService) {
    this.syncSecurityZoneStatus();
  }

  createSecurityZone(origin: Position, dimensions: Dim): void {
    this.zoneOrigin = origin;
    this.zoneDimensions = dimensions;

    this.communicationService.createSecurityZone(origin, dimensions).subscribe((res) => {
      if (res.status === HttpStatusCode.NoContent) {
        this.handleNewSecurityZoneStatus(true);
      }
    });
  }

  syncSecurityZoneStatus(): void {
    this.communicationService.getSecurityZoneStatus().subscribe((response: SecurityZoneStatusResponse) => {
      this.isSecurityZoneActivated = response.status;
      this.zoneOrigin = response.origin;
      this.zoneDimensions = response.dimensions;
      this.handleNewSecurityZoneStatus(response.status);
    });
  }

  deleteSecurityZone(): void {
    this.zoneOrigin = undefined;
    this.zoneDimensions = undefined;

    this.communicationService.deleteSecurityZone().subscribe((res) => {
      if (res.status === HttpStatusCode.NoContent) {
        this.handleNewSecurityZoneStatus(false);
      }
    });
  }

  subscribeToNewSecurityZoneStatusEvent(serviceDestroyed$: Subject<boolean>, callback: (response: boolean) => void): void {
    this.newSecurityZoneStatusEvent.pipe(takeUntil(serviceDestroyed$)).subscribe(callback);
  }

  private handleNewSecurityZoneStatus(status: boolean): void {
    this.isSecurityZoneActivated = status;
    this.newSecurityZoneStatusEvent.next(status);
  }
}

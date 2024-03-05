import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Dim } from '../classes/dim';
import { Pose, Position } from '../classes/position';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface SecurityZoneStatusResponse {
  status: boolean;
  origin: Position | undefined;
  dimensions: Dim | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private baseUrl: string;
  private startMissionEvent: Subject<void> = new Subject();
  private stopMissionEvent: Subject<void> = new Subject();
  private readyEvent: Subject<void> = new Subject();
  private securityZoneCreatedEvent: Subject<void> = new Subject();

  constructor(@Inject(DOCUMENT) private document: Document, private readonly http: HttpClient, private readonly sanitizer: DomSanitizer) {
    this.baseUrl = `http://${document.location.hostname}:3000/api`;
  }

  pageReady(poses: Pose[]): void {
    this.http.post(`${this.baseUrl}/ready`, poses, { observe: 'response' }).subscribe((res) => {
      if (res.status === HttpStatusCode.NoContent) {
        this.readyEvent.next();
      }
    });
  }

  start(sim: boolean): void {
    const endpoint = sim ? 'start/sim' : 'start';
    this.http.post(`${this.baseUrl}/${endpoint}`, {}, { observe: 'response' }).subscribe((res) => {
      if (res.status === HttpStatusCode.Accepted) {
        this.startMissionEvent.next();
      }
    });
  }

  stop(returnToBase: boolean): void {
    const endpoint = returnToBase ? 'stop?return=true' : 'stop?return=false';
    this.http.post(`${this.baseUrl}/${endpoint}`, {}, { observe: 'response' }).subscribe((res) => {
      if (res.status === HttpStatusCode.Accepted) {
        this.stopMissionEvent.next();
      }
    });
  }

  identify(robotNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/identify/${robotNumber}`, {});
  }

  getLogs(): Observable<any> {
    return this.http.get<number[]>(`${this.baseUrl}/logs`);
  }

  getMissionLogs(missionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/logs/${missionId}`, { responseType: 'text' });
  }

  getMap(mapId: number): Observable<SafeResourceUrl> {
    return this.http.get(`${this.baseUrl}/maps/${mapId}`, { responseType: 'blob' }).pipe(
      map((blobFile: any) => {
        const urlToBlob = window.URL.createObjectURL(blobFile);
        return this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob);
      })
    );
  }

  getMissions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/missions`);
  }

  getMissionStatus(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/missionStatus`);
  }

  getMissionType(): Observable<string | null> {
    return this.http.get(`${this.baseUrl}/missionType`, { responseType: 'text' });
  }

  getSecurityZoneStatus(): Observable<any> {
    return this.http.get<SecurityZoneStatusResponse>(`${this.baseUrl}/securityZone`);
  }

  createSecurityZone(origin: Position, dimensions: Dim): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/securityZone`,
      {
        origin: { x: origin.x, y: origin.y },
        dimensions: { width: dimensions.width, height: dimensions.height }
      },
      { observe: 'response' }
    );
  }

  deleteSecurityZone(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/securityZone`, { observe: 'response' });
  }

  subscribeToReadyEvent(serviceDestroyed$: Subject<boolean>, callback: (response: void) => void): void {
    this.readyEvent.pipe(takeUntil(serviceDestroyed$)).subscribe(callback);
  }

  subscribeToStartMissionEvent(serviceDestroyed$: Subject<boolean>, callback: (response: void) => void): void {
    this.startMissionEvent.pipe(takeUntil(serviceDestroyed$)).subscribe(callback);
  }

  subscribeToStopMissionEvent(serviceDestroyed$: Subject<boolean>, callback: (response: void) => void): void {
    this.stopMissionEvent.pipe(takeUntil(serviceDestroyed$)).subscribe(callback);
  }

  subscribeToSecurityZoneCreatedMissionEvent(serviceDestroyed$: Subject<boolean>, callback: (response: void) => void): void {
    this.securityZoneCreatedEvent.pipe(takeUntil(serviceDestroyed$)).subscribe(callback);
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { SecurityZoneDialogComponent } from 'src/app/components/security-zone-dialog/security-zone-dialog.component';
import { CommunicationService } from 'src/app/services/communication.service';
import { MissionService } from 'src/app/services/mission.service';
import { SecurityZoneService } from 'src/app/services/security-zone.service';
import { MissionPageComponent } from './mission-page.component';
import SocketService from 'src/app/services/socket.service';
import { Component } from '@angular/core';
import { MapComponent } from 'src/app/components/map/map.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-log-display',
  template: ''
})
class MockComponent {
  logs = [];
}

describe('MissionPageComponent', () => {
  let component: MissionPageComponent;
  let fixture: ComponentFixture<MissionPageComponent>;
  let mockCommunicationService: CommunicationService;
  let mockSecurityZoneService: SecurityZoneService;
  let mockMissionService: MissionService;

  beforeEach(async () => {
    const communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['getMissionStatus', 'subscribeToStartMissionEvent', 'start', 'stop', 'pageReady', 'getSecurityZoneStatus']);
    communicationServiceSpy.getSecurityZoneStatus.and.returnValue(new Observable());
    communicationServiceSpy.getMissionStatus.and.returnValue(new Observable());

    const securityZoneServiceSpy = jasmine.createSpyObj('SecurityZoneService', ['subscribeToNewSecurityZoneStatusEvent', 'deleteSecurityZone']);
    const socketServiceSpy = jasmine.createSpyObj('SocketService', ['on']);
    const missionServiceSpy = jasmine.createSpyObj('MissionService', ['getIsMissionOngoing', 'resetMission', 'setSimStatus', 'setClientReady']);

    await TestBed.configureTestingModule({
      declarations: [
        MissionPageComponent,
        SecurityZoneDialogComponent,
        MockComponent,
        MapComponent
      ],
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatTabsModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        MatSlideToggleModule
      ],
      providers: [
        { provide: MatDialog, useValue: { open: () => {} } },
        { provide: CommunicationService, useValue: communicationServiceSpy },
        { provide: SecurityZoneService, useValue: securityZoneServiceSpy },
        { provide: SocketService, useValue: socketServiceSpy },
        { provide: MissionService, useValue: missionServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionPageComponent);
    component = fixture.componentInstance;
    
    spyOn<any>(component, 'resetMissionPage').and.callFake(() => {});

    mockCommunicationService = TestBed.inject(CommunicationService);
    mockSecurityZoneService = TestBed.inject(SecurityZoneService);
    mockMissionService = TestBed.inject(MissionService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to start mission event', () => {
    component.startMission();
    expect(mockCommunicationService.subscribeToStartMissionEvent).toHaveBeenCalledWith(component['componentDestroyed$'], jasmine.any(Function));
    expect(component['isSubscribedToReadyEvent']).toBeTrue();
  });

  it('should reset mission page, set sim status and start communication service', () => {
    component.startMission();
    expect(component['resetMissionPage']).toHaveBeenCalled();
    expect(mockMissionService.setSimStatus).toHaveBeenCalledWith(component.simToggle);
    expect(mockCommunicationService.start).toHaveBeenCalledWith(component.simToggle);
  });

  it('should call the stop method of the CommunicationService with false', () => {
    component.stopMission();
    expect(mockCommunicationService.stop).toHaveBeenCalledWith(false);
  });

  it('should return to base', () => {
    component.returnToBase();
    expect(mockCommunicationService.stop).toHaveBeenCalledWith(true);
  });

  it('should open create security zone dialog', () => {
    spyOn(component.dialog, 'open');
    component.openCreateSecurityZoneDialog();
    expect(component.dialog.open).toHaveBeenCalledWith(SecurityZoneDialogComponent);
  });

  it('should call the deleteSecurityZone method of the SecurityZoneService', () => {
    component.deleteSecurityZone();
    expect(mockSecurityZoneService.deleteSecurityZone).toHaveBeenCalled();
  });

  it('should return the correct color for the given index', () => {
    const colors = ['darkgreen', 'indigo'];
    expect(component.color(0)).toBe(colors[0]);
    expect(component.color(1)).toBe(colors[1]);
    expect(component.color(2)).toBe(colors[0]);
    expect(component.color(3)).toBe(colors[1]);
  });
});
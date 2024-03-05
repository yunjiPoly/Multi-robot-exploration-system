import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
import { MissionService } from 'src/app/services/mission.service';
import { MissionLaunchComponent } from './mission-launch.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MissionType } from 'src/app/classes/mission';

export class MatDialogMock {
  open() {
      return {
          afterClosed: () => of({}),
      };
  }
}

describe('MissionLaunchComponent', () => {
  let component: MissionLaunchComponent;
  let fixture: ComponentFixture<MissionLaunchComponent>;
  let mockMissionService: MissionService;
  let mockCommunicationService: CommunicationService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const mockCommunicationService = jasmine.createSpyObj('CommunicationService', ['getMissionStatus', 'getMissionType', 'subscribeToStartMissionEvent', 'start', 'stop', 'pageReady', 'getSecurityZoneStatus']);
    mockCommunicationService.getSecurityZoneStatus.and.returnValue(new Observable());
    mockCommunicationService.getMissionStatus.and.returnValue(new Observable());
    mockCommunicationService.getMissionType.and.returnValue(of(MissionType.Real));

    const mockMissionService = jasmine.createSpyObj('MissionService', ['getIsMissionOngoing', 'resetMission', 'setSimStatus', 'setClientReady']);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [MissionLaunchComponent],
      imports: [ MatSlideToggleModule ],
      providers: [
        { provide: CommunicationService, useValue: mockCommunicationService },
        { provide: MissionService, useValue: mockMissionService },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useClass: MatDialogMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionLaunchComponent);
    component = fixture.componentInstance;

    mockCommunicationService = TestBed.inject(CommunicationService);
    mockMissionService = TestBed.inject(MissionService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call communicationService.subscribeToStartMissionEvent on creation', () => {
    expect(mockCommunicationService.subscribeToStartMissionEvent).toHaveBeenCalledWith(
      jasmine.any(Subject),
      jasmine.any(Function)
    );
  });

  it('should call communicationService.pageReady() and navigate to /mission on startMission', () => {
    component.simToggle = true;
    component.startMission();

    expect(mockMissionService.setSimStatus).toHaveBeenCalledWith(true);
    expect(mockCommunicationService.start).toHaveBeenCalledWith(true);
  });

  it('should navigate to /mission on goToMissionPage', () => {
    component.goToMissionPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/mission']);
  });

  it('should navigate to /missions-history on goToHistory', () => {
    component.goToHistory();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/missions-history']);
  });

  it('should call componentDestroyed$.next() and complete() on ngOnDestroy', () => {
    spyOn(component['componentDestroyed$'], 'next');
    spyOn(component['componentDestroyed$'], 'complete');
    component.ngOnDestroy();
    
    expect(component['componentDestroyed$'].next).toHaveBeenCalledWith(true);
    expect(component['componentDestroyed$'].complete).toHaveBeenCalled();
  });
});
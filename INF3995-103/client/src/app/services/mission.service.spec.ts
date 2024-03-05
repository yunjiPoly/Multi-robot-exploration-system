import { TestBed } from '@angular/core/testing';
import { CommunicationService } from './communication.service';
import { MissionService } from './mission.service';
import { of } from 'rxjs';
import { MissionType } from '../classes/mission';

const DEFAULT_STATUS = true;

describe('MissionService', () => {
  let service: MissionService;
  let mockCommunicationService: jasmine.SpyObj<CommunicationService>;

  beforeEach(() => {
    mockCommunicationService = jasmine.createSpyObj('CommunicationService', [
      'getMissionStatus',
      'getMissionType',
      'subscribeToStartMissionEvent',
      'subscribeToReadyEvent',
      'subscribeToStopMissionEvent',
    ]);
    mockCommunicationService.getMissionStatus.and.returnValue(of(DEFAULT_STATUS));
    mockCommunicationService.getMissionType.and.returnValue(of(MissionType.Real));

    TestBed.configureTestingModule({
      providers: [
        MissionService,
        { provide: CommunicationService, useValue: mockCommunicationService },
      ],
    });

    service = TestBed.inject(MissionService);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the sim status', () => {
    const newSimStatus = true;

    service.setSimStatus(newSimStatus);

    expect(service.getSimStatus()).toBe(newSimStatus);
  });

  it('should reset the mission status', () => {
    service.setClientReady();
    service.setSimStatus(true);
    service.resetMission();

    expect(service.getClientStatus()).toBeFalse();
    expect(service.getSimStatus()).toBeNull();
    expect(service.getIsMissionOngoing()).toBeFalse();
  });

  it('should get the sim status', () => {
    const newSimStatus = true;

    service.setSimStatus(newSimStatus);

    expect(service.getSimStatus()).toBe(newSimStatus);
  });

  it('should get the mission status', () => {
    expect(service.getIsMissionOngoing()).toBe(DEFAULT_STATUS);
  });

  it('should set the client ready status', () => {
    service.setClientReady();

    expect(service.getClientStatus()).toBeTrue();
  });

  it('should subscribe to start, stop and ready events', () => {
    expect(mockCommunicationService.subscribeToStartMissionEvent).toHaveBeenCalled();
    expect(mockCommunicationService.subscribeToStopMissionEvent).toHaveBeenCalled();
    expect(mockCommunicationService.subscribeToReadyEvent).toHaveBeenCalled();
  });
});

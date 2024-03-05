import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RobotStateComponent } from './robot-state.component';
import { CommunicationService } from '../../services/communication.service';
import { Robot, RobotState, RobotType } from '../../classes/robot'
import { of } from 'rxjs';
import SocketService from 'src/app/services/socket.service';
import { ChangeDetectorRef } from '@angular/core';
import { MissionService } from 'src/app/services/mission.service';

const DEFAULT_ROBOT: Robot = {
  id: 'limo1',
  name: 'Limo 1',
  state: RobotState.Stopped,
  type: RobotType.Rover,
  battery: 9.8,
}

describe('RobotStateComponent', () => {
    let component: RobotStateComponent;
    let fixture: ComponentFixture<RobotStateComponent>;
    let mockCommunicationService: CommunicationService;
    let mockMissionService: MissionService;


    beforeEach(async () => {
      const communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['identify']);
      communicationServiceSpy.identify.and.returnValue(of());

      const missionServiceSpy = jasmine.createSpyObj('MissionService', ['getSimStatus']);

      await TestBed.configureTestingModule({
        declarations: [ RobotStateComponent ],
        providers: [
          { provide: SocketService, useValue: missionServiceSpy },
          { provide: ChangeDetectorRef, useClass: class { markForCheck = jasmine.createSpy(); } },
          { provide: CommunicationService, useValue: communicationServiceSpy },
          { provide: MissionService, useValue: missionServiceSpy }

        ],
      })
      .compileComponents();

      fixture = TestBed.createComponent(RobotStateComponent);
      component = fixture.componentInstance;
      component.robot = DEFAULT_ROBOT;

      mockCommunicationService = TestBed.inject(CommunicationService);
      mockMissionService = TestBed.inject(MissionService);

      fixture.detectChanges();

    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call the identify method on CommunicationService when the identify method is called', () => {
      component.identify();
      expect(mockCommunicationService.identify).toHaveBeenCalled();
    });

    it('should call missionsStatus.getSimStatus on getIsSim', () => {
      component.getIsSim();
      expect(mockMissionService.getSimStatus).toHaveBeenCalled();
    });
});

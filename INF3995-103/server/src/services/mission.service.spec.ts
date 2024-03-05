import { expect } from 'chai';
import { Subject } from 'rxjs';
import sinon from 'sinon';
import MissionService from './mission.service';
import { MissionType } from '../classes/mission';



describe('MissionService', () => {
  let missionService: MissionService;

  beforeEach(() => {
    missionService = new MissionService();
  });

  it('should call startMissionEvent.next when startMission is called', () => {
    (missionService as any).isMissionReady = true;
    (missionService as any).missionType = MissionType.Real;
    const startMissionEventSpy = sinon.spy((missionService as any).startMissionEvent, 'next');
    missionService.startMission([]);

    expect(startMissionEventSpy.called).to.be.true;
  });

  it('should call stopMissionEvent.next when stopMission is called', () => {
    const stopMissionEventSpy = sinon.spy((missionService as any).stopMissionEvent, 'next');

    missionService.stopMission(false);

    expect(stopMissionEventSpy.called).to.be.true;
  });

  it('should call identifyRobotEvent.next when identifyRobot is called', () => {
    const identifyRobotEventSpy = sinon.spy((missionService as any).identifyRobotEvent, 'next');

    missionService.identifyRobot('robot1');

    expect(identifyRobotEventSpy.called).to.be.true;
  });

  it('should call createSecurityZoneEvent.next when setSecurityZone is called', () => {
    const createSecurityZoneEventSpy = sinon.spy((missionService as any).createSecurityZoneEvent, 'next');
    missionService['isMissionOngoing'] = true;
    missionService['isSecurityZoneActivated'] = false;
    
    missionService.setSecurityZone({ x: 0, y: 0 }, { width: 2, height: 2 });

    expect(createSecurityZoneEventSpy.called).to.be.true;
  });

  it('should set security zones attributes correctly if mission started and no security zone active when setSecurityZone is called', () => {
    const testOrigin = { x: 4.5, y: 3 };
    const testDimensions = { width: 3, height: 2.5 };
    missionService['isMissionOngoing'] = true;
    missionService['isSecurityZoneActivated'] = false;

    missionService.setSecurityZone(testOrigin, testDimensions);

    expect(missionService['securityZoneOrigin']).to.equal(testOrigin);
    expect(missionService['securityZoneDimensions']).to.equal(testDimensions);
    expect(missionService['isSecurityZoneActivated']).to.be.true;
  });

  it('should call deleteSecurityZoneEvent.next when deleteSecurityZone is called', () => {
    const deleteSecurityZoneEventSpy = sinon.spy((missionService as any).deleteSecurityZoneEvent, 'next');
    missionService['isMissionOngoing'] = true;
    missionService['isSecurityZoneActivated'] = true;

    missionService.deleteSecurityZone();

    expect(deleteSecurityZoneEventSpy.called).to.be.true;
  });

  it('should set security zones attributes correctly if mission started and security zone active when deleteSecurityZone is called', () => {
    const testOrigin = { x: 4.5, y: 3 };
    const testDimensions = { width: 3, height: 2.5 };
    missionService['securityZoneOrigin'] = testOrigin;
    missionService['securityZoneDimensions'] = testDimensions;
    missionService['isMissionOngoing'] = true;
    missionService['isSecurityZoneActivated'] = true;

    missionService.deleteSecurityZone();

    expect(missionService['securityZoneOrigin']).to.be.null;
    expect(missionService['securityZoneDimensions']).to.be.null;
    expect(missionService['isSecurityZoneActivated']).to.be.false;
  });

  it('should call startMissionEvent.pipe and .subscribe when subscribeToStartMissionEvent is called', () => {
    const startMissionEventSpy = sinon.spy((missionService as any).startMissionEvent, 'pipe');
    const subscribeSpy = sinon.spy((missionService as any).startMissionEvent, 'subscribe');

    missionService.subscribeToStartMissionEvent(new Subject(), () => {});

    expect(startMissionEventSpy.called).to.be.true;
    expect(subscribeSpy.called).to.be.true;
  });

  it('should call stopMissionEvent.pipe and .subscribe when subscribeToStopMissionEvent is called', () => {
    const stopMissionEventSpy = sinon.spy((missionService as any).stopMissionEvent, 'pipe');
    const subscribeSpy = sinon.spy((missionService as any).stopMissionEvent, 'subscribe');
    
    missionService.subscribeToStopMissionEvent(new Subject(), () => {});

    expect(stopMissionEventSpy.called).to.be.true;
    expect(subscribeSpy.called).to.be.true;
  });

  it('should call identifyRobotEvent.pipe and .subscribe when subscribeToIdentifyRobotEvent is called', () => {
    const identifyRobotEventSpy = sinon.spy((missionService as any).identifyRobotEvent, 'pipe');
    const subscribeSpy = sinon.spy((missionService as any).identifyRobotEvent, 'subscribe');

    missionService.subscribeToIdentifyRobotEvent(new Subject(), () => {});

    expect(identifyRobotEventSpy.called).to.be.true;
    expect(subscribeSpy.called).to.be.true;
  });

  it('should call createSecurityZoneEvent.pipe and .subscribe when subscribeToCreateSecurityZoneEvent is called', () => {
    const createSecurityZoneEventSpy = sinon.spy((missionService as any).createSecurityZoneEvent, 'pipe');
    const subscribeSpy = sinon.spy((missionService as any).createSecurityZoneEvent, 'subscribe');

    missionService.subscribeToCreateSecurityZoneEvent(new Subject(), () => {});

    expect(createSecurityZoneEventSpy.called).to.be.true;
    expect(subscribeSpy.called).to.be.true;
  });

  it('should call deleteSecurityZoneEvent.pipe and .subscribe when subscribeToDeleteSecurityZoneEvent is called', () => {
    const deleteSecurityZoneEventSpy = sinon.spy((missionService as any).deleteSecurityZoneEvent, 'pipe');
    const subscribeSpy = sinon.spy((missionService as any).deleteSecurityZoneEvent, 'subscribe');

    missionService.subscribeToDeleteSecurityZoneEvent(new Subject(), () => {});

    expect(deleteSecurityZoneEventSpy.called).to.be.true;
    expect(subscribeSpy.called).to.be.true;
  });
});


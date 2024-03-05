import { MissionType } from '../classes/mission';
import { Subject, takeUntil } from 'rxjs';
import { Service } from 'typedi';
import { Dimension, Pose, Position, RobotPosition } from '../classes/position';
import * as fs from 'fs';
import { Robot, RobotStatus } from '@src/classes/robot';

const DEFAULT_TIME = '0.000';
const DEFAULT_DISTANCE = 0.0;

@Service()
export default class MissionService {
    private startMissionEvent: Subject<[MissionType, Pose[]]> = new Subject();
    private stopMissionEvent: Subject<boolean> = new Subject();
    private identifyRobotEvent: Subject<string> = new Subject();
    private missionsStatusEvent: Subject<boolean> = new Subject();
    private logStartingEvent: Subject<void> = new Subject();
    private createSecurityZoneEvent: Subject<[Position, Dimension]> = new Subject();
    private deleteSecurityZoneEvent: Subject<void> = new Subject();

    private isMissionOngoing: boolean = false;
    private isMissionReady: boolean = false;
    private isSecurityZoneActivated: boolean = false;
    private securityZoneOrigin: Position | null = null;
    private securityZoneDimensions: Dimension | null = null;
    private missionType: MissionType | null = null;
    private time: string = DEFAULT_TIME;
    private missionId: number = 1;
    private distance: number = DEFAULT_DISTANCE;
    private robots: Robot[] = [];
    
    getReadyStatus(): boolean {
        return this.isMissionReady;
    }

    getOngoingStatus(): boolean {
        return this.isMissionOngoing;
    }
    
    getIsSecurityZoneActivated(): boolean {
        return this.isSecurityZoneActivated;
    }

    getSecurityZoneOrigin(): Position | null {
        return this.securityZoneOrigin;
    }

    getSecurityZoneDimensions(): Dimension | null {
        return this.securityZoneDimensions;
    }

    getMissionType(): MissionType | null {
        return this.missionType;
    }

    getMissionId(): number {
        return this.missionId;
    }

    getDistance(): number {
        return this.distance;
    }

    getTime(): string {
        return this.time;
    }

    getRobotNamesAsString(): string {
        return this.robots.map((robot) => robot.name).join('\n');
    }

    addRobot(newRobot: RobotStatus): void {
        if (!this.robots.map((robot) => robot.id).includes(newRobot.id)) {
            this.robots.push({ id: newRobot.id, name: newRobot.name, type: newRobot.type });
        }
    }

    removeRobot(id: string): void {
        if (this.robots.map((robot) => robot.id).includes(id)) {
            this.robots = this.robots.filter((robot) => robot.id !== id);
        }

        if (this.robots.length === 0) {
            this.isMissionOngoing = false;
            this.missionType = null;
        }
    }

    updateMissionId(): void {
	    while(fs.existsSync(`/server/src/logs/mission_${this.missionId}.txt`)) {
			this.missionId++;
        }
	}
    
    prepareMission(missiontype: MissionType): void {
        this.updateMissionId();
        this.logStartingEvent.next();
        this.missionType = missiontype;
        this.isMissionReady = true;
    }
    
    startMission(poses: Pose[]): void {
        if (this.isMissionReady && this.missionType !== null) {
            this.startMissionEvent.next([this.missionType, poses]);
            this.resetMission();
            this.isMissionOngoing = true;
        } else {
            throw new Error('Attempt to start mission without mission type aborted.');
        }
    }
    
    stopMission(returnToBase: boolean): void {
        this.isMissionOngoing = false;
        this.missionType = null;
        this.robots = [];
        this.missionsStatusEvent.next(this.isMissionOngoing);
        this.stopMissionEvent.next(returnToBase);
    }
    
    identifyRobot(robotId: string): void {
        this.identifyRobotEvent.next(robotId);
    }

    setSecurityZone(origin: Position, dimensions: Dimension): void {
        if (this.isMissionOngoing && !this.isSecurityZoneActivated) {
            this.securityZoneOrigin = origin;
            this.securityZoneDimensions = dimensions;
            this.isSecurityZoneActivated = true;
            this.createSecurityZoneEvent.next([origin, dimensions]);
        }
    }

    deleteSecurityZone(): void {
        if (this.isMissionOngoing && this.isSecurityZoneActivated) {
            this.securityZoneOrigin = null;
            this.securityZoneDimensions = null;
            this.isSecurityZoneActivated = false;
            this.deleteSecurityZoneEvent.next();
        }
    }

    handleDistance(robotDistance: RobotPosition[]): void {
        robotDistance.forEach((newDistance) => {
            this.distance += newDistance.distance;
        });
    }

    handleTime(time: any): void {
        this.time = parseFloat(`${time.secs}.${time.ns}`).toFixed(3);
    }
    
    subscribeLogStartingEvent(serviceDestroyed$: Subject<boolean>, callback: (response: void) => void): void {
        this.logStartingEvent.pipe(takeUntil(serviceDestroyed$)).subscribe(callback);
    }
    
    subscribeToStartMissionEvent(serviceDestroyed$: Subject<boolean>, callback: (response: [MissionType, Pose[]]) => void): void {
        this.startMissionEvent.pipe(takeUntil(serviceDestroyed$)).subscribe(callback);
    }

    subscribeToStopMissionEvent(serviceDestroyed$: Subject<boolean>, callback: (response: boolean) => void): void {
        this.stopMissionEvent.pipe(takeUntil(serviceDestroyed$)).subscribe(callback);
    }
    
    subscribeToIdentifyRobotEvent(serviceDestroyed$: Subject<boolean>, callback: (response: string) => void): void {
        this.identifyRobotEvent.pipe(takeUntil(serviceDestroyed$)).subscribe(callback);
    }
    
    subscribeToMissionStatusEvent(serviceDestroyed$: Subject<boolean>, callback: (response: boolean) => void): void {
        this.missionsStatusEvent.pipe(takeUntil(serviceDestroyed$)).subscribe(callback);
    }

    subscribeToCreateSecurityZoneEvent(serviceDestroyed$: Subject<boolean>, callback: (response: [Position, Dimension]) => void): void {
        this.createSecurityZoneEvent.pipe(takeUntil(serviceDestroyed$)).subscribe(callback);
    }

    subscribeToDeleteSecurityZoneEvent(serviceDestroyed$: Subject<boolean>, callback: (response: void) => void): void {
        this.deleteSecurityZoneEvent.pipe(takeUntil(serviceDestroyed$)).subscribe(callback);
    }
    
    private resetMission(): void {
        this.isMissionReady = false;
        this.time = DEFAULT_TIME;
        this.distance = DEFAULT_DISTANCE;
    }
}
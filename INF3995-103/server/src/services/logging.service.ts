import { Service } from 'typedi';
import { SocketService } from './socket.service';
import { Server } from 'http';
import MissionService from './mission.service';
import { Subject } from 'rxjs';
import { RobotPosition } from '../classes/position';
import { LoggingFilesService } from './logging-files.service';

const ONE_SECOND_INTERVAL = 1000;
const DEFAULT_TIME = '0.000';

@Service()
export class LoggingService {
    private intervalId: NodeJS.Timeout;
    private serviceDestroyed$: Subject<boolean> = new Subject();
    private currentPositions: RobotPosition[] = [];
    
    constructor(
        private socketService: SocketService,
        private readonly missionService: MissionService,
        private loggingFilesService: LoggingFilesService,
        ) {
        this.missionService.subscribeLogStartingEvent(this.serviceDestroyed$, () => {
            this.start();
        });
    }

    initialize(server: Server): void {
        this.socketService.initialize(server);
        this.socketService.handleSockets();
    }
    
    start(): void {
        this.loggingFilesService.createLogFile(this.missionService.getMissionId());
        this.intervalId = setInterval(() => {
            // Only send positions log if the mission has actually begun
            if (this.missionService.getTime() !== DEFAULT_TIME) {
                let message = `Positions after ${this.missionService.getTime()} seconds :`;
                this.currentPositions.forEach((position) => {
                    message += `\n\t${position.name} : ${JSON.stringify(position.pos)}`;
                });
                this.sendLogMessage(message);
            }
        }, ONE_SECOND_INTERVAL);
    }

    stop(): void {
        clearInterval(this.intervalId);
        this.currentPositions = [];
    }

    handleNewPosition(newPosition: RobotPosition[]): void {  
        this.currentPositions = newPosition;
    }

    handleLowBattery(lowBatteryRobotId: string): void {
        this.sendLogMessage(`${lowBatteryRobotId}'s battery is down to 30%. Returning to base...`);
    }

    sendLogMessage(message: string): void {
        this.socketService.emitLog(message);
        this.loggingFilesService.writeToLogFile(message, this.missionService.getMissionId());
    }

    sendCommandLog(message: string): void {
        this.sendLogMessage(`Command sent from server : ${message}`);
    }
}


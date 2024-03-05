import MissionService from '../services/mission.service';
import { Subject } from 'rxjs';
import { Service } from 'typedi';
import node from 'rosnodejs';
import { MissionType } from '../classes/mission';
import { MapService } from '../services/map.service';
import { Dimension, Pose, Position } from '../classes/position';
import { LoggingService } from '../services/logging.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
const nav_msgs = node.require('nav_msgs');

@Service()
export class RobotCommunicationController {
    mapData: any;
    private serviceDestroyed$: Subject<boolean> = new Subject();
    private pubMissionCmd: any = null;
    private pubSecurityZone: any = null;
    
    constructor(
        private readonly missionService: MissionService,
        private readonly mapService: MapService,
        private readonly loggingService: LoggingService
    ) {
        this.missionService.subscribeToStartMissionEvent(this.serviceDestroyed$, ([missionType, poses]) => {
            this.startMission(missionType, poses);
        });

        this.missionService.subscribeToStopMissionEvent(this.serviceDestroyed$, (returnToBase) => {
            const stoppingMessage = returnToBase ? 'Stopping mission, returning to base...' : 'Stopping mission...';
            console.log(stoppingMessage);
            this.stopMission(returnToBase);
        });

        this.missionService.subscribeToIdentifyRobotEvent(this.serviceDestroyed$, (robotId) => {
            console.log('Connecting robots...');
            this.identifyRobot(robotId);
        });

        this.missionService.subscribeToCreateSecurityZoneEvent(this.serviceDestroyed$, (zoneData: [Position, Dimension]) => {
            this.createSecurityZone(zoneData[0], zoneData[1]);
        });

        this.missionService.subscribeToDeleteSecurityZoneEvent(this.serviceDestroyed$, () => {
            this.deleteSecurityZone();
        });
    }

    initPublishers(): void {
        this.pubMissionCmd = node.nh.advertise('/mission_cmd', 'std_msgs/String');
        this.pubSecurityZone = node.nh.advertise('/security_zone', 'nav_msgs/MapMetaData');
        console.log('Server node publishers initialized');
    }

    startMission(missionType: MissionType, poses: Pose[]): void {
        if (this.pubMissionCmd) {
            const startingMessage = missionType === MissionType.Real ? 'Starting real mission...' : 'Starting simulation...';
            console.log(startingMessage);

            const initCommand = `start,${missionType}`;
            let command = initCommand;
            poses.forEach((pose) => (command += `,${pose.x},${pose.y},${pose.orientation}`));

            this.pubMissionCmd.publish({ data: command });
            this.loggingService.sendCommandLog(
                `${initCommand} with relative position of second robot : { x: ${poses[0].x}, y: ${poses[0].y}, orientation: ${poses[0].orientation} }`
            );
        } else {
            throw new Error('mission_cmd publisher not initalized');
        }
    }

    stopMission(returnToBase: boolean): void {
        if (this.pubMissionCmd) {
            const command = returnToBase ? 'stop,returning to base' : 'stop';
            this.pubMissionCmd.publish({ data: `stop,${returnToBase}` });
            this.loggingService.sendCommandLog(command);
            this.mapService.saveMap(this.mapData, this.missionService.getMissionId());
        } else {
            throw new Error('mission_cmd publisher not initalized');
        }
    }

    identifyRobot(robotId: string): void {
        if (this.pubMissionCmd) {
            const command = `identify,${robotId}`;
            this.pubMissionCmd.publish({ data: command });
            this.loggingService.sendCommandLog(command);
        }
    }

    createSecurityZone(origin: Position, dimensions: Dimension): void {
        if (this.pubSecurityZone) {
            const data = new nav_msgs.msg.MapMetaData();
            data.width = dimensions.width;
            data.height = dimensions.height;
            data.origin.position.x = origin.x;
            data.origin.position.y = origin.y;
            this.pubSecurityZone.publish(data);

            const commandLog = `Creating security zone of ${dimensions.width}x${dimensions.height}m centered in (${origin.x},${origin.y})`;
            this.loggingService.sendCommandLog(commandLog);
        } else {
            throw new Error('security_zone publisher not initalized');
        }
    }

    deleteSecurityZone(): void {
        if (this.pubSecurityZone) {
            const data = new nav_msgs.msg.MapMetaData();
            data.width = 0;
            data.height = 0;
            this.pubSecurityZone.publish(data);

            const commandLog = 'Deleting security zone';
            this.loggingService.sendCommandLog(commandLog);
        } else {
            throw new Error('security_zone publisher not initalized');
        }
    }
}
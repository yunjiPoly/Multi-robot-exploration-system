import { HttpException } from '../classes/http-exception';
import MissionService from '../services/mission.service';
import { MissionType } from '../classes/mission';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { LoggingFilesService } from '../services/logging-files.service';
import { MapService } from '../services/map.service';
import { Dimension, Pose, Position } from '../classes/position';
import { MissionHistoryService } from '../services/mission-history.service';
import DatabaseService from '../services/database.service';

@Service()
export class ClientCommunicationController {
    router: Router;

    constructor(
        private missionService: MissionService,
        private loggingFilesService: LoggingFilesService,
        private missionHistoryService: MissionHistoryService,
        private databaseService: DatabaseService,
        private readonly mapService: MapService,
    ) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/start', (req, res: Response) => {
            try {
                this.handlePrepareMission(MissionType.Real);
                res.status(StatusCodes.ACCEPTED).send();
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });

        this.router.post('/start/sim', (req, res: Response) => {
            try {
                this.handlePrepareMission(MissionType.Simulation);
                res.status(StatusCodes.ACCEPTED).send();
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });

        this.router.post('/stop', async (req, res: Response) => {
            try {
                const returnToBase = req.query.return === 'true';
                this.handleStopMission(returnToBase);
                res.status(StatusCodes.ACCEPTED).send();
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });

        this.router.post('/identify/:robotNumber', (req, res: Response) => {
            const { robotNumber } = req.params;

            try {
                this.handleIdentify(robotNumber);
                res.status(StatusCodes.NO_CONTENT).send();
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });

        this.router.post('/ready', (req, res: Response) => {
            try {
                if (this.missionService.getReadyStatus()) {
                    const poses = req.body;
                    this.handleStartMission(poses);
                    res.status(StatusCodes.NO_CONTENT).send();
                }
                else {
                    res.status(StatusCodes.BAD_REQUEST).send();
                }
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });

        this.router.get('/missionStatus', (req: Request, res: Response) => {
            try {
                res.status(StatusCodes.OK).send(this.missionService.getOngoingStatus());
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });

        this.router.get('/missionType', (req: Request, res: Response) => {
            try {
                res.status(StatusCodes.OK).send(this.missionService.getMissionType());
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });

        this.router.get('/securityZone', (req: Request, res: Response) => {
            try {
                const origin = this.missionService.getSecurityZoneOrigin();
                const dimensions = this.missionService.getSecurityZoneDimensions();
                res.status(StatusCodes.OK).send({ 
                    status: this.missionService.getIsSecurityZoneActivated(), 
                    origin: JSON.stringify(origin), 
                    dimensions: JSON.stringify(dimensions) 
                });
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });

        this.router.post('/securityZone', (req: Request, res: Response) => {
            const origin: Position = req.body.origin;
            const dimensions: Dimension = req.body.dimensions;

            try {
                if (!this.missionService.getIsSecurityZoneActivated()) {
                    this.missionService.setSecurityZone(origin, dimensions);
                    res.status(StatusCodes.NO_CONTENT).send();
                } else {
                    res.status(StatusCodes.BAD_REQUEST).send();
                }
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });

        this.router.delete('/securityZone', (req: Request, res: Response) => {
            try {
                if (this.missionService.getIsSecurityZoneActivated()) {
                    this.missionService.deleteSecurityZone();
                    res.status(StatusCodes.NO_CONTENT).send();
                } else {
                    res.status(StatusCodes.BAD_REQUEST).send();
                }
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });

        this.router.get('/logs/:missionId', (req, res: Response) => {
            try {
                const { missionId } = req.params;
                const logs = this.loggingFilesService.getLogFile(missionId);
                res.status(StatusCodes.OK).send(logs);
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });

        this.router.get('/logs', (_, res: Response) => {
            try {
                const ids = this.loggingFilesService.getAvailableLogs();
                res.status(StatusCodes.OK).send(ids);
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });

        this.router.get('/maps/:missionId', async (req, res: Response) => {
            try {
                const { missionId } = req.params;
                const mapPath = this.mapService.getMap(missionId);
                if (mapPath !== null){
                    res.setHeader('Content-Type', 'image/png');
                    res.status(StatusCodes.OK);
                    res.sendFile(mapPath);
                } else {
                    throw new Error('Map doesn\'t exists');
                }
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });
        this.router.get('/missions', async (_, res: Response) => {
            try {
                res.status(StatusCodes.OK).send(await this.databaseService.database);
            } catch (exception: any) {
                HttpException.sendError(exception, res);
            }
        });
    }

    private handlePrepareMission(missiontype: MissionType): void {
        this.missionService.prepareMission(missiontype);
    }

    private handleStartMission(poses: Pose[]): void {
        this.missionService.startMission(poses);
    }

    private async handleStopMission(returnToBase : boolean): Promise<void> {
        await this.missionHistoryService.saveMission();
        this.missionService.stopMission(returnToBase);
    }

    private handleIdentify(robotId: string): void {
        console.log(`Identifying robot #${robotId}`);
        this.missionService.identifyRobot(robotId);
    }
}

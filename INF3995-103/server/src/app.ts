import { HttpException } from './classes/http-exception';
import cors from 'cors';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from 'morgan';
import { join } from 'path';
import { Service } from 'typedi';
import { ClientCommunicationController } from './controllers/client-communication-controller';
import { RobotCommunicationController } from './controllers/robot-communication-controller';
import node from 'rosnodejs';
import { LoggingService } from './services/logging.service';
import { SocketService } from './services/socket.service';
import MissionService from './services/mission.service';
import { RobotPosition } from './classes/position';
import { RobotState, RobotStatus } from './classes/robot';

@Service()
export class Application {
    app: express.Application;
    private readonly internalError: number = StatusCodes.INTERNAL_SERVER_ERROR;
    
    constructor(
        private readonly clientCommunicationController: ClientCommunicationController,
        private readonly robotCommunicationController: RobotCommunicationController,
        private loggingService: LoggingService,
        private missionService: MissionService,
        private socketService: SocketService,
    ) {
        this.app = express();

        this.config();

        this.setPublicDirectory();

        this.bindRoutes();

        this.initNode();
        
    }

    bindRoutes(): void {
        this.app.use('/api', this.clientCommunicationController.router);
        this.errorHandling();
    }

    initNode(): void {
        node.initNode('/server')
            .then((rosNode) => {
                console.log('Server Node online');

                this.robotCommunicationController.initPublishers();

                rosNode.subscribe('/map', 'nav_msgs/OccupancyGrid',
                    (data: any) => {
                        this.robotCommunicationController.mapData = data;
                        this.socketService.emitMap(data);
                    }
                );
                    
                rosNode.subscribe('/robot_position', 'std_msgs/String',
                    (data: any) => {
                        const parsed: RobotPosition[] = JSON.parse(data.data);
                        if (parsed.every((robot) => robot.pos !== null)) this.loggingService.handleNewPosition(parsed);
                        if (parsed.every((robot) => robot.distance !== null)) this.missionService.handleDistance(parsed);
                        this.socketService.emitRobotsPos(parsed);
                    }
                );

                rosNode.subscribe('/robot_state', 'std_msgs/String',
                    (data: any) => {
                        const robotStatuses: RobotStatus[] = JSON.parse(data.data);
                        if (robotStatuses.length > 0) {
                            robotStatuses.forEach((status: RobotStatus) => {
                                this.missionService.addRobot(status);
                            });
                            this.socketService.emitRobotState(robotStatuses);
                        }
                        
                        // If all robots have been stopped, stop sending logs
                        if (robotStatuses.filter((robot: RobotStatus) => robot.state !== RobotState.Stopped).length === 0) {
                            this.loggingService.stop();
                        }
                    }
                );

                rosNode.subscribe('/low_battery', 'std_msgs/String',
                    (data: any) => {
                        const lowBatteryRobotId = JSON.parse(data.data);
                        this.loggingService.handleLowBattery(lowBatteryRobotId);
                        this.missionService.removeRobot(lowBatteryRobotId);
                    }
                );
                
                rosNode.subscribe('/clock', 'rosgraph_msgs/Clock',
                    (data: any) => {
                        this.missionService.handleTime(data.clock);
                    }
                );

                console.log('Server Node subscribed');
            });
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(express.json({ limit: '10MB' }));
        this.app.use(express.urlencoded({ limit: '10MB', parameterLimit: 100000, extended: true }));
        this.app.use(cors());
    }

    private setPublicDirectory(): void {
        const path = join(__dirname, '../public');
        this.app.use('/public', express.static(path));
    }

    private errorHandling(): void {
        // When previous handlers have not served a request: path wasn't found
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: HttpException = new HttpException('Not Found', StatusCodes.NOT_FOUND);
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}

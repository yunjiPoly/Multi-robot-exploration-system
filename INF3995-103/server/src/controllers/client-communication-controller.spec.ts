import { ClientCommunicationController } from "./client-communication-controller";
import MissionService from "../services/mission.service";
import * as sinon from 'sinon';
import { LoggingFilesService } from "../services/logging-files.service";
import { MapService } from "../services/map.service";
import 'reflect-metadata';
import { MissionHistoryService } from "../services/mission-history.service";
import DatabaseService from "../services/database.service";
import { Application } from "../app";
import supertest from "supertest";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../classes/http-exception";
import { MissionType } from "../classes/mission";
import { Dimension, Position } from "@src/classes/position";
import { SocketService } from "../services/socket.service";
import { LoggingService } from "../services/logging.service";
import { RobotCommunicationController } from "./robot-communication-controller";

const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const expect = chai.expect;

const DEFAULT_EXCEPTION = 'exception';
const DEFAULT_ROBOT_ID = '1';
const DEFAULT_ORIGIN: Position = { x: 0, y: 0 };
const DEFAULT_DIMENSION: Dimension = { width: 2, height: 2 };
const DEFAULT_MISSION_ID = '1';

describe("ClientCommunicationController", () => {
    let controller: ClientCommunicationController;
    let missionServiceStub: sinon.SinonStubbedInstance<MissionService>;
    let loggingFilesServiceStub: sinon.SinonStubbedInstance<LoggingFilesService>;
    let missionHistoryStub: sinon.SinonStubbedInstance<MissionHistoryService>;
    let mapServiceStub: sinon.SinonStubbedInstance<MapService>;
    let databaseService: sinon.SinonStubbedInstance<DatabaseService>;

    let loggingServiceStub: sinon.SinonStubbedInstance<LoggingService>;
    let socketServiceStub: sinon.SinonStubbedInstance<SocketService>;
    let robotControllerStub: sinon.SinonStubbedInstance<RobotCommunicationController>;
    let expressApp: Express.Application;

    beforeEach(() => {
        missionServiceStub = sinon.createStubInstance(MissionService);
        loggingFilesServiceStub = sinon.createStubInstance(LoggingFilesService);
        mapServiceStub = sinon.createStubInstance(MapService);
        missionHistoryStub = sinon.createStubInstance(MissionHistoryService);
        loggingServiceStub = sinon.createStubInstance(LoggingService);
        robotControllerStub = sinon.createStubInstance(RobotCommunicationController);
        socketServiceStub = sinon.createStubInstance(SocketService);
        
        controller = new ClientCommunicationController(missionServiceStub, loggingFilesServiceStub, missionHistoryStub, databaseService, mapServiceStub);
        
        const app = new Application(controller, robotControllerStub, loggingServiceStub, missionServiceStub, socketServiceStub);
        expressApp = app.app;
    });

    afterEach(() => {
        sinon.restore();
        chai.spy.restore();
    });

    it("should call missionService.startMission on handleStartMission", async () => {
        controller['handleStartMission']([]);
        expect(missionServiceStub.startMission.calledOnce).to.be.true;
    });

    it("should call missionService.stopMission on handleStopMission", async () => {
        await controller['handleStopMission'](false);
        expect(missionServiceStub.stopMission.calledOnce).to.be.true;
    });

    it("should call missionService.identify on handleIdentify", async () => {
        controller['handleIdentify']("1");
        expect(missionServiceStub.identifyRobot.calledOnce).to.be.true;
    });

    describe('POST start/sim', () => {
        it('should return ACCEPTED', async () => {
            return await supertest(expressApp).post(`/api/start/sim`).expect(StatusCodes.ACCEPTED);
        });

        it('should return error code if exception occurs', async () => {
            chai.spy.on(controller, 'handlePrepareMission', () => {
                throw new HttpException(DEFAULT_EXCEPTION, StatusCodes.BAD_REQUEST);
            });

            return await supertest(expressApp).post(`/api/start/sim`).expect(StatusCodes.BAD_REQUEST);
        });

        it('should call handlePrepareMission with Simulation mission', async () => {
            const prepareMissionSpy = chai.spy.on(controller, 'handlePrepareMission', () => {});
            return await supertest(expressApp).post(`/api/start/sim`).then(() => {
                expect(prepareMissionSpy).to.be.have.been.called.with(MissionType.Simulation);
            });
        });
    });

    describe('POST start', () => {
        it('should return ACCEPTED', async () => {
            return await supertest(expressApp).post(`/api/start`).expect(StatusCodes.ACCEPTED);
        });

        it('should return error code if exception occurs', async () => {
            chai.spy.on(controller, 'handlePrepareMission', () => {
                throw new HttpException(DEFAULT_EXCEPTION, StatusCodes.BAD_REQUEST);
            });

            return await supertest(expressApp).post(`/api/start`).expect(StatusCodes.BAD_REQUEST);
        });

        it('should call handlePrepareMission with Real mission', async () => {
            const prepareMissionSpy = chai.spy.on(controller, 'handlePrepareMission', () => {});
            return await supertest(expressApp).post(`/api/start`).then(() => {
                expect(prepareMissionSpy).to.be.have.been.called.with(MissionType.Real);
            });
        });
    });

    describe('POST stop', () => {
        it('should return ACCEPTED', async () => {
            return await supertest(expressApp).post(`/api/stop`).expect(StatusCodes.ACCEPTED);
        });

        it('should return error code if exception occurs', async () => {
            chai.spy.on(controller, 'handleStopMission', () => {
                throw new HttpException(DEFAULT_EXCEPTION, StatusCodes.BAD_REQUEST);
            });

            return await supertest(expressApp).post(`/api/stop`).expect(StatusCodes.BAD_REQUEST);
        });

        it('should call handleStopMission', async () => {
            const stopMissionSpy = chai.spy.on(controller, 'handleStopMission', () => {});
            return await supertest(expressApp).post(`/api/stop`).then(() => {
                expect(stopMissionSpy).to.be.have.been.called();
            });
        });
    });

    describe('POST identify/:robotNumber', () => {
        it('should return NO_CONTENT', async () => {
            return await supertest(expressApp).post(`/api/identify/${DEFAULT_ROBOT_ID}`).expect(StatusCodes.NO_CONTENT);
        });

        it('should return error code if exception occurs', async () => {
            chai.spy.on(controller, 'handleIdentify', () => {
                throw new HttpException(DEFAULT_EXCEPTION, StatusCodes.BAD_REQUEST);
            });

            return await supertest(expressApp).post(`/api/identify/${DEFAULT_ROBOT_ID}`).expect(StatusCodes.BAD_REQUEST);
        });

        it('should call handleIdentify', async () => {
            const identifySpy = chai.spy.on(controller, 'handleIdentify', () => {});
            return await supertest(expressApp).post(`/api/identify/${DEFAULT_ROBOT_ID}`).then(() => {
                expect(identifySpy).to.be.have.been.called.with(DEFAULT_ROBOT_ID);
            });
        });
    });

    describe('POST ready', () => {
        it('should return NO_CONTENT if mission is ready', async () => {
            chai.spy.on(controller['missionService'], 'getReadyStatus', () => true);
            return await supertest(expressApp).post(`/api/ready`).expect(StatusCodes.NO_CONTENT);
        });

        it('should return BAD_REQUEST if mission is not ready', async () => {
            chai.spy.on(controller['missionService'], 'getReadyStatus', () => false);
            return await supertest(expressApp).post(`/api/ready`).expect(StatusCodes.BAD_REQUEST);
        });

        it('should return error code if exception occurs', async () => {
            chai.spy.on(controller['missionService'], 'getReadyStatus', () => true);
            chai.spy.on(controller, 'handleStartMission', () => {
                throw new HttpException(DEFAULT_EXCEPTION, StatusCodes.BAD_REQUEST);
            });

            return await supertest(expressApp).post(`/api/ready`).expect(StatusCodes.BAD_REQUEST);
        });

        it('should call handleStartMission', async () => {
            chai.spy.on(controller['missionService'], 'getReadyStatus', () => true);
            const startMissionSpy = chai.spy.on(controller, 'handleStartMission', () => {});

            return await supertest(expressApp).post(`/api/ready`).then(() => {
                expect(startMissionSpy).to.be.have.been.called();
            });
        });
    });

    describe('GET missionStatus', () => {
        it('should return OK', async () => {
            return await supertest(expressApp).get(`/api/missionStatus`).expect(StatusCodes.OK);
        });

        it('should return error code if exception occurs', async () => {
            chai.spy.on(controller['missionService'], 'getOngoingStatus', () => {
                throw new HttpException(DEFAULT_EXCEPTION, StatusCodes.BAD_REQUEST);
            });

            return await supertest(expressApp).get(`/api/missionStatus`).expect(StatusCodes.BAD_REQUEST);
        });

        it('should have result in body', async () => {
            chai.spy.on(controller['missionService'], 'getOngoingStatus', () => true);
            return expect((await supertest(expressApp).get(`/api/missionStatus`)).body).to.be.true;
        });
    });

    describe('GET securityZone', () => {
        it('should return OK', async () => {
            return await supertest(expressApp).get(`/api/securityZone`).expect(StatusCodes.OK);
        });

        it('should return error code if exception occurs', async () => {
            chai.spy.on(controller['missionService'], 'getSecurityZoneOrigin', () => {
                throw new HttpException(DEFAULT_EXCEPTION, StatusCodes.BAD_REQUEST);
            });

            return await supertest(expressApp).get(`/api/securityZone`).expect(StatusCodes.BAD_REQUEST);
        });

        it('should call expected methods', async () => {
            const originSpy = chai.spy.on(controller['missionService'], 'getSecurityZoneOrigin', () => DEFAULT_ORIGIN);
            const dimensionsSpy = chai.spy.on(controller['missionService'], 'getSecurityZoneDimensions', () => DEFAULT_DIMENSION);
            return await supertest(expressApp).get(`/api/securityZone`).then(() => {
                expect(originSpy).to.be.have.been.called();
                expect(dimensionsSpy).to.be.have.been.called();
            });
        });
    });

    describe('POST securityZone', () => {
        it('should return NO_CONTENT if no security zone is active', async () => {
            chai.spy.on(controller['missionService'], 'getIsSecurityZoneActivated', () => false);
            chai.spy.on(controller['missionService'], 'setSecurityZone', () => {});
            return await supertest(expressApp).post(`/api/securityZone`).expect(StatusCodes.NO_CONTENT);
        });

        it('should return BAD_REQUEST if a security zone is already active', async () => {
            chai.spy.on(controller['missionService'], 'getIsSecurityZoneActivated', () => true);
            return await supertest(expressApp).post(`/api/securityZone`).expect(StatusCodes.BAD_REQUEST);
        });

        it('should return error code if exception occurs', async () => {
            chai.spy.on(controller['missionService'], 'getIsSecurityZoneActivated', () => false);
            chai.spy.on(controller['missionService'], 'setSecurityZone', () => {
                throw new HttpException(DEFAULT_EXCEPTION, StatusCodes.BAD_REQUEST);
            });

            return await supertest(expressApp).post(`/api/securityZone`).expect(StatusCodes.BAD_REQUEST);
        });
    });

    describe('DELETE securityZone', () => {
        it('should return NO_CONTENT if security zone is active', async () => {
            chai.spy.on(controller['missionService'], 'getIsSecurityZoneActivated', () => true);
            chai.spy.on(controller['missionService'], 'deleteSecurityZone', () => {});
            return await supertest(expressApp).delete(`/api/securityZone`).expect(StatusCodes.NO_CONTENT);
        });

        it('should return BAD_REQUEST if no security zone is active', async () => {
            chai.spy.on(controller['missionService'], 'getIsSecurityZoneActivated', () => false);
            return await supertest(expressApp).delete(`/api/securityZone`).expect(StatusCodes.BAD_REQUEST);
        });

        it('should return error code if exception occurs', async () => {
            chai.spy.on(controller['missionService'], 'getIsSecurityZoneActivated', () => true);
            chai.spy.on(controller['missionService'], 'deleteSecurityZone', () => {
                throw new HttpException(DEFAULT_EXCEPTION, StatusCodes.BAD_REQUEST);
            });

            return await supertest(expressApp).delete(`/api/securityZone`).expect(StatusCodes.BAD_REQUEST);
        });
    });

    describe('GET logs/:missionId', () => {
        it('should return OK and have result in body', async () => {
            const testLogString = 'i am a log hihahu';
            chai.spy.on(controller['loggingFilesService'], 'getLogFile', () => testLogString);
            return await supertest(expressApp).get(`/api/logs/${DEFAULT_MISSION_ID}`).expect(StatusCodes.OK, testLogString);
        });

        it('should return error code if exception occurs', async () => {
            chai.spy.on(controller['loggingFilesService'], 'getLogFile', () => {
                throw new HttpException(DEFAULT_EXCEPTION, StatusCodes.BAD_REQUEST);
            });

            return await supertest(expressApp).get(`/api/logs/${DEFAULT_MISSION_ID}`).expect(StatusCodes.BAD_REQUEST);
        });
    });

    describe('GET logs', () => {
        it('should return OK and have result in body', async () => {
            const testLogIds = [1, 2, 3, 4, 5];
            chai.spy.on(controller['loggingFilesService'], 'getAvailableLogs', () => testLogIds);
            return await supertest(expressApp).get(`/api/logs`).expect(StatusCodes.OK, JSON.stringify(testLogIds));
        });

        it('should return error code if exception occurs', async () => {
            chai.spy.on(controller['loggingFilesService'], 'getAvailableLogs', () => {
                throw new HttpException(DEFAULT_EXCEPTION, StatusCodes.BAD_REQUEST);
            });

            return await supertest(expressApp).get(`/api/logs`).expect(StatusCodes.BAD_REQUEST);
        });
    });
});

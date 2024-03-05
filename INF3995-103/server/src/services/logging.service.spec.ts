import * as sinon from 'sinon';
import { expect } from 'chai';
import http from 'http'
import { SocketService } from './socket.service';
import { LoggingService } from './logging.service';
import MissionService from './mission.service';
import { LoggingFilesService } from './logging-files.service';

describe('LoggingService', () => {
	let loggingService: LoggingService;
	let socketService: SocketService;
	let mockServer: http.Server;
	let missionService: MissionService;
	let loggingFilesService: LoggingFilesService;

	beforeEach(() => {
		socketService = new SocketService();
		missionService = new MissionService();
		loggingFilesService = sinon.createStubInstance(LoggingFilesService);
		loggingService = new LoggingService(socketService, missionService, loggingFilesService);
		mockServer = http.createServer();
		socketService.initialize(mockServer);
	});

	it('should call socketService initialize and handle sockets when initialize is called', () => {
		const initializeStub = sinon.stub((loggingService as any).socketService, 'initialize');
		const handleSocketsStub = sinon.stub((loggingService as any).socketService, 'handleSockets');

		loggingService.initialize(mockServer);
		expect(initializeStub.called).to.be.true;
		expect(handleSocketsStub.called).to.be.true;
	});

	// it('should call createLogFile when start is called', () => {
	// 	const createLogFileStub = sinon.spy((loggingService as any).loggingFilesService, 'createLogFile');

	// 	loggingService.start();
	// 	expect(createLogFileStub.called).to.be.true;
	// });

	it('should call clearInterval when stop is called', () => {
		const clearIntervalStub = sinon.stub(global, 'clearInterval');

		loggingService.stop();
		expect(clearIntervalStub.called).to.be.true;
		expect((loggingService as any).currentPositions).to.be.deep.equal([]);
	});

	it('should call emitLog when sendLogMessage is called', () => {
		const emitLogStub = sinon.stub((loggingService as any).socketService, 'emitLog');

		loggingService.sendLogMessage('test');
		expect(emitLogStub.called).to.be.true;
	});

	// it('should call writeToLogFile when sendLogMessage is called', () => {
	// 	const writeToLogFileStub = sinon.stub((loggingService as any).loggingFilesService, 'writeToLogFile');

	// 	loggingService.sendLogMessage('test');
	// 	expect(writeToLogFileStub.called).to.be.true;
	// 	expect(writeToLogFileStub.calledWith('test')).to.be.true;
	// });
});
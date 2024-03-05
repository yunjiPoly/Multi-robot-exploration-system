import * as sinon from 'sinon';
import { expect } from 'chai';
import http from 'http'
import { SocketService } from './socket.service';

describe('SocketService', () => {
    let socketService: SocketService;
    let mockServer: http.Server;
    
    beforeEach(() => {
        socketService = new SocketService();
        mockServer = http.createServer();
        socketService.initialize(mockServer);
    });
  
    it('should throw an error if socket service is not initialized', () => {
        socketService['sio'] = undefined;
  
        expect(() => socketService.handleSockets()).to.throw('Socket service not initialized');
      });

    it('should emit log to the "log" room', () => {
        const emitStub = sinon.stub(socketService as any, 'emit');
        const message = 'test message';
        socketService.emitLog(message);
    
        expect(emitStub.calledWith('log', message)).to.be.true;
      });
    
    it('should emit robot state to the "robotState" room', () => {
        const emitStub = sinon.stub(socketService as any, 'emit');

        socketService.emitRobotState([]);

        expect(emitStub.calledWith('robotState', [])).to.be.true;
    });

    it('should emit map to the "map" room', () => {
        const emitStub = sinon.stub(socketService as any, 'emit');
        socketService.emitMap('test map data');
        
        expect(emitStub.calledWith('map', 'test map data')).to.be.true;
    });
});
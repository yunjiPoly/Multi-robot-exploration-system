import * as io from 'socket.io';
import { Service } from 'typedi';
import http from 'http';
import { RobotPosition } from '@src/classes/position';
import { RobotStatus } from '@src/classes/robot';

export type SocketEmitEvents = 'log' | 'robotState' | 'map' | 'position';


@Service()
export class SocketService {
    private sio?: io.Server;

    initialize(server: http.Server): void {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET'] } });
    }

    handleSockets(): void {
        if (this.sio === undefined) throw new Error('Socket service not initialized');

        this.sio.on('connection', (socket) => {
            console.log(`New connection to socket ${socket.id}`);
        });
    }

    emitLog(message: string): void {
        this.emit('log', message);
    }

    emitRobotState(stateJson: RobotStatus[]): void {
        this.emit('robotState', stateJson);
    }

    emitMap(mapData: any): void {
        this.emit('map', mapData);
    }

    emitRobotsPos(posData: RobotPosition[]): void {
        this.emit('position', posData as any);
    }

    private emit(ev: SocketEmitEvents, message: any): void {
        if (this.sio === undefined) throw new Error('Socket service not initialized');

        this.sio.emit(ev, message);
    }
}


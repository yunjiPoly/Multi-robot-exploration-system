export class Robot {
    id: string;
    name: string;
    type: RobotType;
}

export enum RobotType {
    Rover
}

export enum RobotState {
    Running = 'En mission',
    Waiting = 'En attente',
    Stopped = 'Arrêté'
}

export interface RobotStatus {
    id: string;
    name: string;
    state: RobotState;
    type: RobotType;
    battery: number;
}
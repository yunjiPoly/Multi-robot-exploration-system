export enum RobotState {
  Running = 'En mission',
  Stopped = 'Arrêté'
}

export enum RobotType {
  Drone = 'Drone',
  Rover = 'Rover'
}

export interface Robot {
  id: string;
  name: string;
  state: RobotState;
  type: RobotType;
  battery: number;
}

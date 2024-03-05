export interface Position {
  x: number;
  y: number;
}

export interface Pose extends Position {
  orientation: number;
}

export interface RobotPosition {
  id: string;
  name: string;
  pos: Pose;
}

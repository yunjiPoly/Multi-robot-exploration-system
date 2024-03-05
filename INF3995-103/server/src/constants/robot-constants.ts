export enum PossibleRobotStates {
    Running = 'Actif',
    Waiting = 'En attente',
    Stopped = 'Arrêté',
    Crashed = 'Accident'
};

export enum PossibleMissionStates {
    NotStarted = 'Pas commencée',
    Waiting = 'En attente',
    Running = 'En cours',
    Ended = 'Terminée'
};

export enum PossibleRobotTypes {
    Drone = 'Drone',
    Rover = 'Rover',
    None = 'None'
};

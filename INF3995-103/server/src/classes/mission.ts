export class Mission {
    id: number;
    type: MissionType;
    duration: string;
    date: Date;
    distance: number;
    logs: string;
    robots: string;
}


export enum MissionType {
    Simulation = 'Simulation',
    Real = 'Réelle',
}

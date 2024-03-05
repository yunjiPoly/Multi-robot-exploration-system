import { SafeResourceUrl } from '@angular/platform-browser';

export enum MissionType {
  Simulation = 'Simulation',
  Real = 'Réelle'
}

export interface MissionElement {
  id: number;
  time: string;
  type: MissionType;
  distance: number;
  date: Date;
  robots: string;
  logs: string;
  mapSrc: SafeResourceUrl;
}

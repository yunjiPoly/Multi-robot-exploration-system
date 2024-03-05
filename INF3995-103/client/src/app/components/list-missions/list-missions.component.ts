import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { MissionElement } from 'src/app/classes/mission';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-list-missions',
  templateUrl: './list-missions.component.html',
  styleUrls: ['./list-missions.component.scss']
})
export class ListMissionsComponent implements OnInit {
  missions: MissionElement[] = [];
  sortingStatuses: Map<string, boolean | null> = new Map<string, boolean | null>([
    ['id', null],
    ['time', null],
    ['type', null],
    ['distance', null],
    ['date', null],
    ['logs', null]
  ]);

  constructor(private communicationService: CommunicationService) {}

  ngOnInit(): void {
    this.communicationService.getMissions().subscribe((response) => {
      response.forEach((mission: MissionElement) => {
        this.communicationService.getMissionLogs(mission.id).subscribe((missionLog) => {
          this.communicationService.getMap(mission.id).subscribe((url: SafeResourceUrl) => {
            this.missions.push({
              id: mission.id,
              time: mission.time,
              type: mission.type,
              robots: mission.robots,
              date: new Date(mission.date),
              distance: mission.distance,
              logs: missionLog,
              mapSrc: url
            });
          });
        });
      });
    });
  }

  sortById(): void {
    this.updateSortStatus('id');

    this.missions.sort((a, b) => (this.sortingStatuses.get('id') ? a.id - b.id : b.id - a.id));
  }

  sortByTime(): void {
    this.updateSortStatus('time');

    this.missions.sort((a, b) =>
      this.sortingStatuses.get('time') ? parseFloat(a.time) - parseFloat(b.time) : parseFloat(b.time) - parseFloat(a.time)
    );
  }

  sortByType(): void {
    this.updateSortStatus('type');

    this.missions.sort((a, b) => {
      if (a.type < b.type) {
        return this.sortingStatuses.get('type') ? -1 : 1;
      } else if (a.type > b.type) {
        return this.sortingStatuses.get('type') ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  sortByDate(): void {
    this.updateSortStatus('date');

    this.missions.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.sortingStatuses.get('date') ? dateA - dateB : dateB - dateA;
    });
  }

  sortByDistance(): void {
    this.updateSortStatus('distance');

    this.missions.sort((a, b) => (this.sortingStatuses.get('distance') ? a.distance - b.distance : b.distance - a.distance));
  }

  private getNextSortStatus(currentStatus: boolean | null): boolean | null {
    switch (currentStatus) {
      case null:
        return true;
      case true:
        return false;
      case false:
        return null;
    }
  }

  private updateSortStatus(updateKey: string): void {
    for (const key of this.sortingStatuses.keys()) {
      if (key === updateKey) {
        this.sortingStatuses.set(key, this.getNextSortStatus(this.sortingStatuses.get(key) ?? null));
      } else {
        this.sortingStatuses.set(key, null);
      }
    }
  }
}

import { Component, Input } from '@angular/core';
import { Robot } from 'src/app/classes/robot';
import { CommunicationService } from '../../services/communication.service';
import { MissionService } from 'src/app/services/mission.service';

@Component({
  selector: 'app-robot-state',
  templateUrl: './robot-state.component.html',
  styleUrls: ['./robot-state.component.scss']
})
export class RobotStateComponent {
  @Input() robot: Robot;
  @Input() color: string;

  constructor(private communicationService: CommunicationService, private missionService: MissionService) {}

  identify(): void {
    this.communicationService.identify(this.robot.id).subscribe();
  }

  getIsSim(): boolean {
    return this.missionService.getSimStatus() !== false;
  }
}

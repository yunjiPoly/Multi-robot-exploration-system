import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import SocketService from 'src/app/services/socket.service';

@Component({
  selector: 'app-log-display',
  templateUrl: './log-display.component.html',
  styleUrls: ['./log-display.component.scss']
})
export class LogDisplayComponent implements OnDestroy {
  logs: string[] = [];

  constructor(private socketService: SocketService, private changeDetection: ChangeDetectorRef) {
    this.socketService.on('log', (log: string) => {
      this.logs.push(log);
      this.changeDetection.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.logs = [];
  }
}

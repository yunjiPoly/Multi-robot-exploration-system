import { Component } from '@angular/core';
import { Router } from '@angular/router';
import SocketService from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private readonly socketService: SocketService) {
    this.socketService.initializeService();
  }
}

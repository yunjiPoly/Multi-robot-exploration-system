import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export default class SocketService {
  private socket!: Socket;
  private baseUrl: string;

  constructor(@Inject(DOCUMENT) private document: Document, private readonly http: HttpClient) {
    this.baseUrl = `http://${document.location.hostname}:3000/`;
  }

  initializeService(): void {
    this.socket = this.getSocket();
    console.log('Socket service initialized');
  }

  on<T>(ev: string, handler: (arg: T) => void): void {
    if (!this.socket) return;

    this.socket.on(ev, handler);
  }

  private getSocket(): Socket {
    return io(this.baseUrl, { transports: ['websocket'], upgrade: false });
  }
}

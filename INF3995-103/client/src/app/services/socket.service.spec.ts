import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import  SocketService from './socket.service';

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SocketService]
    });
    service = TestBed.inject(SocketService);
    TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize the service', () => {
    spyOn(console, 'log');
    service.initializeService();
    expect(console.log).toHaveBeenCalledWith('Socket service initialized');
  });

  it('initializeService should call the getSocket() method', () => {
    spyOn((service as any), 'getSocket');
    service.initializeService();
    expect((service as any).getSocket).toHaveBeenCalled();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import SocketService from 'src/app/services/socket.service';
import { LogDisplayComponent } from './log-display.component';

describe('LogDisplayComponent', () => {
  let component: LogDisplayComponent;
  let fixture: ComponentFixture<LogDisplayComponent>;
  let socketServiceSpy: jasmine.SpyObj<SocketService>;

  beforeEach(async () => {
    socketServiceSpy = jasmine.createSpyObj('SocketService', ['on']);

    await TestBed.configureTestingModule({
      declarations: [ LogDisplayComponent ],
      providers: [
        { provide: SocketService, useValue: socketServiceSpy },
        { provide: ChangeDetectorRef, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create the LogDisplayComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the logs array', () => {
    expect(component.logs).toEqual([]);
  });

  it('should call the SocketService on method when created', () => {
    expect(socketServiceSpy.on).toHaveBeenCalledWith('log', jasmine.any(Function));
  });

  it('should clear the logs array on component destruction', () => {
    component.logs = ['Log message 1', 'Log message 2'];
    component.ngOnDestroy();
    expect(component.logs).toEqual([]);
  });
});

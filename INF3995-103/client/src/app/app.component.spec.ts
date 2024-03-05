import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { RobotStateComponent } from './components/robot-state/robot-state.component';
import { MapComponent } from './components/map/map.component';
import SocketService from './services/socket.service';
import SpyObj = jasmine.SpyObj;
import { CommunicationService } from './services/communication.service';
import { Observable } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';

describe('AppComponent', () => {
  let socketServiceMock: SpyObj<SocketService>;
  let communicationServiceMock: SpyObj<CommunicationService>;

  beforeEach(async () => {
    socketServiceMock = jasmine.createSpyObj('SockerService', ['initializeService'])
    socketServiceMock.initializeService.and.returnValue();

    communicationServiceMock = jasmine.createSpyObj('CommunicationService', ['getMissionStatus']);
    communicationServiceMock.getMissionStatus.and.returnValue(new Observable<boolean>);
    
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        RobotStateComponent,
        MapComponent,
        AppComponent,
        HeaderComponent
      ],
      providers: [
        { provide: SocketService, useValue: socketServiceMock },
        { provide: CommunicationService, useValue: communicationServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});


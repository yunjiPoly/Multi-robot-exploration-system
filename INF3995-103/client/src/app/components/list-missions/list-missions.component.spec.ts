import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMissionsComponent } from './list-missions.component';
import { CommunicationService } from 'src/app/services/communication.service';
import { MissionElement, MissionType } from 'src/app/classes/mission';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const TEST_URL = 'http://nana-bananas.com';
const TEST_MISSION_1: MissionElement = {
  id: 1,
  time: '01:30:00',
  type: MissionType.Real,
  robots: 'Limo 1',
  date: new Date('2022-07-20'),
  distance: 100,
  logs: 'log1',
  mapSrc: TEST_URL
};

const TEST_MISSION_2: MissionElement = {
  id: 2,
  time: '02:45:00',
  type: MissionType.Simulation,
  robots: 'Limo 1\nLimo 2',
  date: new Date('2022-05-21'),
  distance: 200,
  logs: 'log2',
  mapSrc: TEST_URL
}

describe('ListMissionsComponent', () => {
  let component: ListMissionsComponent;
  let fixture: ComponentFixture<ListMissionsComponent>;
  let communicationService: CommunicationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListMissionsComponent],
      imports: [ MatCardModule, MatExpansionModule, BrowserAnimationsModule , MatIconModule],
      providers: [
        {
          provide: CommunicationService,
          useValue: {
            getMissions: () => of([TEST_MISSION_2, TEST_MISSION_1]),
            getMissionLogs: (id: number) => of(`log${id}`),
            getMap: () => of(TEST_URL)
          }
        },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustResourceUrl: () => 'safeUrl',
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMissionsComponent);
    component = fixture.componentInstance;
    communicationService = TestBed.inject(CommunicationService);
    spyOn(communicationService, 'getMissions').and.callThrough();
    spyOn(communicationService, 'getMissionLogs').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch missions and their logs on component initialization', () => {
    expect(communicationService.getMissions).toHaveBeenCalled();
    expect(communicationService.getMissionLogs).toHaveBeenCalledTimes(2);
    expect(component.missions.length).toBe(2);
  });

  it('should sort missions by id', () => {
    component.sortById();
    expect(component.missions).toEqual([TEST_MISSION_1, TEST_MISSION_2]);
  });

  it('should sort missions by time', () => {
    component.sortByTime();
    expect(component.missions).toEqual([TEST_MISSION_1, TEST_MISSION_2]);
  });

  it('should sort missions by type', () => {
    component.sortByType();
    expect(component.missions).toEqual([TEST_MISSION_1, TEST_MISSION_2]);
  });

  it('should sort missions by date', () => {
    component.sortByDate();
    expect(component.missions).toEqual([TEST_MISSION_2, TEST_MISSION_1]);
  });

  it('should sort missions by distance', () => {
    component.sortByDistance();
    expect(component.missions).toEqual([TEST_MISSION_1, TEST_MISSION_2]);
  });
});
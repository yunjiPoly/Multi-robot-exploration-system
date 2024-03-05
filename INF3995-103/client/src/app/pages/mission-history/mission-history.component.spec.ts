import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionHistoryComponent } from './mission-history.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('MissionHistoryComponent', () => {
  let component: MissionHistoryComponent;
  let fixture: ComponentFixture<MissionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionHistoryComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

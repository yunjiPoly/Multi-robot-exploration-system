import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { MapComponent } from './map.component';
import { GridService } from 'src/app/services/grid.service';
import SocketService from 'src/app/services/socket.service';
import { Pose, RobotPosition } from 'src/app/classes/position';
import { MatIconModule } from '@angular/material/icon';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let gridServiceSpy: jasmine.SpyObj<GridService>;
  let socketServiceSpy: jasmine.SpyObj<SocketService>;

  beforeEach(async () => {
    const gridSpy = jasmine.createSpyObj('GridService', ['clearGrid', 'drawGrid', 'drawRobot']);
    const socketSpy = jasmine.createSpyObj('SocketService', ['on']);

    await TestBed.configureTestingModule({
      declarations: [MapComponent],
      imports: [MatIconModule],
      providers: [
        { provide: GridService, useValue: gridSpy },
        { provide: SocketService, useValue: socketSpy },
        ChangeDetectorRef
      ]
    }).compileComponents();

    gridServiceSpy = TestBed.inject(GridService) as jasmine.SpyObj<GridService>;
    socketServiceSpy = TestBed.inject(SocketService) as jasmine.SpyObj<SocketService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    component.colors = ['darkgreen', 'indigo'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fit canvas to container', () => {
    const canvas = document.createElement('canvas');
    spyOn(canvas, 'getContext').and.returnValue(jasmine.createSpyObj(['clearRect']));
    component.fitToContainer(canvas);
    expect(canvas.style.width).toBe('100%');
    expect(canvas.style.height).toBe('100%');
    expect(canvas.width).toBe(canvas.offsetWidth);
    expect(canvas.height).toBe(canvas.offsetHeight);
  });

  it('should listen to socketService events', () => {
    const testMap: any = {};
    const testPos: Pose = { x: 5, y: 10, orientation: 90 };
    const testRobotPosition: RobotPosition = { id: 'limo1', name: 'Limo 1', pos: testPos}

    component.redraw();
    socketServiceSpy.on.calls.argsFor(0)[1](testMap);
    socketServiceSpy.on.calls.argsFor(1)[1]([testRobotPosition]);

    expect(gridServiceSpy.clearGrid).toHaveBeenCalled();
    expect(gridServiceSpy.drawRobot).toHaveBeenCalledWith(testPos, component.colors[0]);
  });
});

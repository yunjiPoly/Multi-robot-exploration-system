import { TestBed } from '@angular/core/testing';
import { GridService } from './grid.service';
import { CanvasTestHelper } from '../classes/canvas-test-helper';
import { TestMap } from '../classes/canvas-test-map';
import { Pose } from '../classes/position';
describe('GridService', () => {
  let service: GridService;
  let context: CanvasRenderingContext2D;
  const testMap = new TestMap();
  const pose: Pose = { x: 1, y : 3, orientation: 0};
  const CANVAS_WIDTH = 718;
  const CANVAS_HEIGHT = 631;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridService);

    const canvas = document.createElement('canvas');
    canvas.width = service.width;
    canvas.height = service.height;
    context = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
    
    service.gridContext = context;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(' width should return the width of the grid canvas', () => {
    expect(service.width).toEqual(CANVAS_WIDTH);
    expect(service.height).toEqual(CANVAS_HEIGHT);
  });

  it('should draw the grid on the canvas', () => {
    spyOn(context, 'beginPath');
    spyOn(context, 'moveTo');
    spyOn(context, 'lineTo');
    spyOn(context, 'stroke');
    const fillTextSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
    const defineSpy = spyOn(service, 'defineOrigin').and.callThrough();
    const coordinateSPy = spyOn(service,'drawCoordinate').and.callThrough();
    service.drawGrid(testMap, 4, 4);
    
    // Verify that the expected lines were drawn on the canvas
    expect(context.beginPath).toHaveBeenCalled();
    expect(context.strokeStyle).toBe('#000000');
    expect(defineSpy).toHaveBeenCalled();
    expect(coordinateSPy).toHaveBeenCalled();
    expect(fillTextSpy).toHaveBeenCalled();

    expect(context.stroke).toHaveBeenCalled();
  });

  it(' drawGrid should color pixels on the canvas', () => {
    let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
    const beforeSize = imageData.filter((x) => x !== 0).length;
    service.drawGrid(testMap, 4, 4);
    imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
    const afterSize = imageData.filter((x) => x !== 0).length;
    expect(afterSize).toBeGreaterThan(beforeSize);
  });

  it('should call draw the Robot in green when calling drawRobot', () => {
    const fillStyleSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
    service.drawRobot(pose, 'darkgreen');
    expect(fillStyleSpy).toHaveBeenCalled();
  });

  it('should call clearRect when calling clearGrid', () => {
    const fillStyleSpy = spyOn(service.gridContext, 'clearRect').and.callThrough();
    service.clearGrid();
    expect(fillStyleSpy).toHaveBeenCalled();
  });
});
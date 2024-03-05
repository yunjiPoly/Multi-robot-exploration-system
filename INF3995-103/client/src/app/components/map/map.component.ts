import { AfterViewInit, Component, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, HostListener, Input } from '@angular/core';
import { GridService } from 'src/app/services/grid.service';
import SocketService from 'src/app/services/socket.service';
import { RobotPosition } from 'src/app/classes/position';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @Input() colors: string[];

  @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;

  map: any = [];
  pos: RobotPosition[] = [];

  constructor(private readonly gridService: GridService, private socketService: SocketService, private changeDetection: ChangeDetectorRef) {
    // receive the "big big" map
    this.socketService.on('map', (map: any) => {
      this.map = map;
      this.redraw();
      this.changeDetection.detectChanges();
    });
    // receive the position of the robot base on the point origin
    this.socketService.on('position', (pos: RobotPosition[]) => {
      this.pos = pos;
      this.redraw();
      this.changeDetection.detectChanges();
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.fitToContainer(this.gridCanvas.nativeElement);
  }

  ngAfterViewInit(): void {
    this.fitToContainer(this.gridCanvas.nativeElement);

    this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.gridService.clearGrid();

    this.gridCanvas.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.gridService.clearGrid();
    this.map = [];
  }

  redraw(): void {
    if (!this.map || !this.gridCanvas) return;
    this.gridService.clearGrid();
    this.gridService.drawGrid(this.map, this.gridCanvas.nativeElement.width, this.gridCanvas.nativeElement.height);
    this.pos.filter((robot) => robot.pos !== null).forEach((robot, i) => this.gridService.drawRobot(robot.pos, this.colors[i % this.colors.length]));
  }

  fitToContainer(canvas: HTMLCanvasElement): void {
    // Make it visually fill the positioned parent
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    // ...then set the internal size to match
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
}

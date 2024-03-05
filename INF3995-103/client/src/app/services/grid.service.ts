import { Injectable } from '@angular/core';
import { Dim } from '../classes/dim';
import { Pose } from '../classes/position';
export const DEFAULT_WIDTH = 718;
export const DEFAULT_HEIGHT = 631;
export const RESOLUTION = 4;
export const VERT_AQUA = '#719696';
export const WHITE_YELLOW = '#eaedda';
export const GREY = '#808080';
export const YELLOW_LESS = '#c9bc8d';
export const BLACK = '#000000';
export const LINE_WIDTH = 3;
export const WHITE_YELLOW_LIMIT = 40;
export const GREY_LIMIT = 60;
export const YELLOW_LESS_LIMIT = 80;
export const UPPER_LIMIT = 100;
export const SQUARE_WIDTH = 20;
export const ADJUST_VALUE_13 = 13;
export const ADJUST_VALUE_6 = 6;
export const ADJUST_VALUE_15 = 15;
export const ADJUST_VALUE_3 = 3;
export const ADJUST_VALUE_2 = 2;

@Injectable({
  providedIn: 'root'
})
export class GridService {
  gridContext: CanvasRenderingContext2D;
  private resolutionX: number = RESOLUTION;
  private resolutionY: number = RESOLUTION;
  private canvasSize: Dim = { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
  private originOfRobot: Dim = { width: 0, height: 0 };

  get width(): number {
    return this.canvasSize.width;
  }

  get height(): number {
    return this.canvasSize.height;
  }

  clearGrid(): void {
    if (this.gridContext) {
      this.gridContext.strokeStyle = 'black';
      this.gridContext.clearRect(0, 0, DEFAULT_WIDTH * 2, DEFAULT_HEIGHT * 2);
    }
  }

  drawGrid(map: any, currentWidth: number, currentHeight: number): void {
    this.resolutionX = currentWidth / map.info.width;
    this.resolutionY = currentHeight / map.info.height;

    this.gridContext.beginPath();
    this.gridContext.strokeStyle = 'black';
    this.gridContext.lineWidth = LINE_WIDTH;

    for (let x = 0; x < map.info.width; x++) {
      for (let y = 0; y < map.info.height; y++) {
        // Display the map
        // Topic /map gives coordonnees, but mirrored, which means that an image at right bottom is on the left bottom
        const index = x + (map.info.width - y - 1) * map.info.width;
        const value = map.data[index];

        let color = 'white';
        if (value === -1) {
          color = VERT_AQUA;
        } else if (value === 0) {
          color = WHITE_YELLOW;
        } else if (value > 0 && value <= WHITE_YELLOW_LIMIT) {
          color = WHITE_YELLOW;
        } else if (value > WHITE_YELLOW_LIMIT && value <= GREY_LIMIT) {
          color = GREY;
        } else if (value > GREY_LIMIT && value < YELLOW_LESS_LIMIT) {
          color = YELLOW_LESS;
        } else if (value > YELLOW_LESS_LIMIT && value < UPPER_LIMIT) {
          color = BLACK;
        }
        this.gridContext.fillStyle = color;
        this.gridContext.fillRect(x * this.resolutionX, y * this.resolutionY, this.resolutionX, this.resolutionY);
      }

      this.defineOrigin(map.info.origin.position.x, map.info.origin.position.y);
    }
    this.gridContext.stroke();

    this.drawCoordinateGrid();
    this.drawCoordinate(currentWidth, currentHeight);
  }

  drawRobot(pose: Pose, color: string): void {
    this.gridContext.fillStyle = color;
    this.gridContext.fillRect(
      this.originOfRobot.width + pose.x * SQUARE_WIDTH * this.resolutionX,
      this.originOfRobot.height + -pose.y * SQUARE_WIDTH * this.resolutionY,
      SQUARE_WIDTH,
      SQUARE_WIDTH
    );
  }

  // The definition of the reference that are used for defining the robot position
  defineOrigin(posX: number, posY: number): void {
    this.originOfRobot = { width: SQUARE_WIDTH * -posY * this.resolutionX, height: SQUARE_WIDTH * -posX * this.resolutionY };
  }

  drawCoordinate(currentWidth: number, currentHeight: number): void {
    // |
    this.gridContext.beginPath();
    this.gridContext.moveTo(this.originOfRobot.width, 0);
    this.gridContext.lineTo(this.originOfRobot.width, currentHeight);
    // -
    this.gridContext.moveTo(0, this.originOfRobot.height);
    this.gridContext.lineTo(currentWidth, this.originOfRobot.height);

    this.gridContext.strokeStyle = 'black';
    this.gridContext.lineWidth = 0.8;
    this.gridContext.stroke();
  }

  drawCoordinateGrid(): void {
    for (let i = 0; i < 10; i++) {
      this.gridContext.fillStyle = 'black';

      // this part designes the coordinate on the horizontal
      // this draws the text 1 to 5
      if (i !== 0) {
        this.gridContext.fillText(
          i.toString(),
          i * SQUARE_WIDTH * this.resolutionX + this.originOfRobot.width - 1,
          this.originOfRobot.height + ADJUST_VALUE_13
        );
      }
      // this draws the "dot" on the grid
      this.gridContext.fillRect(
        i * SQUARE_WIDTH * this.resolutionX + this.originOfRobot.width,
        this.originOfRobot.height - ADJUST_VALUE_3,
        ADJUST_VALUE_2,
        ADJUST_VALUE_3
      );
      this.gridContext.fillRect(
        -i * SQUARE_WIDTH * this.resolutionX + this.originOfRobot.width,
        this.originOfRobot.height - ADJUST_VALUE_2,
        ADJUST_VALUE_2,
        ADJUST_VALUE_3
      );
      // this draws the text 0 to -5
      this.gridContext.fillText(
        (-i).toString(),
        -i * SQUARE_WIDTH * this.resolutionX + this.originOfRobot.width - ADJUST_VALUE_6,
        this.originOfRobot.height + ADJUST_VALUE_13
      );

      // this part designes the coordinate on the vertical
      // this draws the text -5 to 5
      if (i !== 0) {
        this.gridContext.fillText(
          (-i).toString(),
          this.originOfRobot.width - ADJUST_VALUE_15,
          i * SQUARE_WIDTH * this.resolutionY + this.originOfRobot.height + ADJUST_VALUE_6
        );
        this.gridContext.fillText(
          i.toString(),
          this.originOfRobot.width - ADJUST_VALUE_13,
          -i * SQUARE_WIDTH * this.resolutionY + this.originOfRobot.height + ADJUST_VALUE_6
        );

        // draws the"dot" on the grid
        this.gridContext.fillRect(
          this.originOfRobot.width - ADJUST_VALUE_3,
          -i * SQUARE_WIDTH * this.resolutionY + this.originOfRobot.height,
          ADJUST_VALUE_2,
          ADJUST_VALUE_3
        );
        this.gridContext.fillRect(
          this.originOfRobot.width - ADJUST_VALUE_3,
          i * SQUARE_WIDTH * this.resolutionY + this.originOfRobot.height,
          ADJUST_VALUE_2,
          ADJUST_VALUE_3
        );
      }
    }
  }
}

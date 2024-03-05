/* eslint-disable */ 
const MAP = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, 52, 52, 52, -1, 52, -1, -1, 52, -1, 52, -1, -1, -1, 52, -1, 52, -1, 55,
-1, 52, 49, 52, -1, 52, 52, 52, 52, -1, -1, 52, 55, 55, 52, 52, 52, 52, 52, 52, 52,
52, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
const RANDOM_HEIGHT = 24;
const RANDOM_WIDTH = 20;
const RANDOM_RESOLUTION = 0.05;
const RANDOM_ORIGIN_X = -4.1;
const RANDOM_ORIGIN_Y = -6.0;

export class TestMap {
    constructor() {
        this.info = new Info();
        this.info.height = RANDOM_HEIGHT;
        this.info.width = RANDOM_WIDTH;
        this.info.resolution = RANDOM_RESOLUTION;
        this.info.origin.position.x = RANDOM_ORIGIN_X;
        this.info.origin.position.y = RANDOM_ORIGIN_Y;
        this.data = MAP;

    }
    info: Info;
    // data.length = 480 
    data: number[];

}
export class Header {
    seq: number;
}
export class Info {
    resolution: number;
    width: number;
    height: number;
    origin = new Origin();
}
export class Origin {
    position = new Position();
}
export class Position {
    x: number;
    y: number;
    z: number;
}
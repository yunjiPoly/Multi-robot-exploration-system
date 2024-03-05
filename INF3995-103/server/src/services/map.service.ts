import { Service } from 'typedi';
import * as pngjs from 'pngjs';
import * as fs from 'fs';

const OBSTACLE_THRESHOLD = 75;
const OBSTACLE_COLOR = 64;
const FREE_COLOR = 255;
const UNKNOWN_COLOR = 128;
const MAP_SCALE = 5;
@Service()
export class MapService {
	private readonly mapFilePath = '/server/src/maps';
		
		saveMap(mapData: any, missionId: number): void {
			if (mapData === undefined) return;

			const grayBuffer = Buffer.alloc(mapData.info.width * mapData.info.height);
		
			for (let y = 0; y < mapData.info.height; y++) {
				for (let x = 0; x < mapData.info.width; x++) {

					// Mirror data so its coherent with the client side
					const computedY = mapData.info.height - y - 1;
					const index = (computedY * mapData.info.width + x);
					const value = mapData.data[y * mapData.info.width + x];

					if (value >= OBSTACLE_THRESHOLD) {
						grayBuffer.writeUInt8(OBSTACLE_COLOR, index);
					} else if (value >= 0 && value < OBSTACLE_THRESHOLD) {
						grayBuffer.writeUInt8(FREE_COLOR, index);
					} else {
						grayBuffer.writeUInt8(UNKNOWN_COLOR, index);
					}
				}
			}

			// Original image is too small, scale it up by a factor of 5
			const scaledBuffer = this.scaleImageBuffer(grayBuffer, mapData.info.width, mapData.info.height, MAP_SCALE);		

			const png = new pngjs.PNG({
				width: mapData.info.width * MAP_SCALE,
				height: mapData.info.height * MAP_SCALE,
				colorType: 0,
				inputColorType: 0,
				bitDepth: 8,
				inputHasAlpha: false,
			});

			const pngFilePath = `${this.mapFilePath}/mission_${missionId}.png`;
			png.data = scaledBuffer;
			png.pack().pipe(fs.createWriteStream(pngFilePath));
		}
		
		scaleImageBuffer(buffer: Buffer, width: number, height: number, scale: number): Buffer {
			const scaledBuffer = Buffer.alloc(width * scale * height * scale);
			for (let y = 0; y < height * scale; y++) {
				const srcY = Math.floor(y / scale);
				for (let x = 0; x < width * scale; x++) {
					const srcX = Math.floor(x / scale);
					const srcIndex = srcY * width + srcX;
					const destIndex = y * (width * scale) + x;
					const originalPixel = buffer.readUInt8(srcIndex);
					scaledBuffer.writeUInt8(originalPixel, destIndex);
				}
			}
			return scaledBuffer;
		}


		getMap(missionId: string): string | null {
			// read and return the map file
			const availableMaps = this.getAvailableMapIds();
			const mapFile = availableMaps.includes(parseInt(missionId, 10)) ? `${this.mapFilePath}/mission_${missionId}.png` : null;
			return mapFile;
		}

		getAvailableMapIds(): number[] {
			const ids: number[] = [];
			fs.readdirSync(this.mapFilePath, {encoding: 'utf-8'}).forEach((file) => {
				ids.push(parseInt(file.split('_')[1].split('.')[0], 10));
			});
			return ids;
		}
	}
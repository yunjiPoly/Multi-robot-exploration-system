import { MapService } from './map.service';
import { expect } from 'chai';

// write tests for map service

describe('MapService', () => {
	let mapService: MapService;

	beforeEach(() => {
		mapService = new MapService();
	});

	it('should create', () => {
		expect(mapService).to.not.be.undefined;
	});

	// it('should return a map', () => {
	// 	sinon.stub(fs, 'createReadStream').returns('test' as any);
	// 	const map = mapService.getMap('1');
	// 	expect(map).to.not.be.undefined;
	// });
});

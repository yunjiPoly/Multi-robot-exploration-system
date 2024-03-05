import { of } from 'rxjs';
import { CommunicationService, SecurityZoneStatusResponse } from './communication.service';
import { SecurityZoneService } from './security-zone.service';
import { TestBed } from '@angular/core/testing';
import { HttpStatusCode } from '@angular/common/http';

const DEFAULT_ZONE_STATUS: SecurityZoneStatusResponse = {
  status: true,
  origin: { x: 3, y: -3 },
  dimensions: { width: 2, height: 6 }
}

describe('SecurityZoneService', () => {
  let service: SecurityZoneService;
  let communicationServiceMock: jasmine.SpyObj<CommunicationService>;

  beforeEach(() => {
    communicationServiceMock = jasmine.createSpyObj('CommunicationService', ['createSecurityZone', 'getSecurityZoneStatus', 'deleteSecurityZone']);
    communicationServiceMock.getSecurityZoneStatus.and.returnValue(of(DEFAULT_ZONE_STATUS));
    communicationServiceMock.createSecurityZone.and.returnValue(of({ status: HttpStatusCode.NoContent }));
    communicationServiceMock.deleteSecurityZone.and.returnValue(of({ status: HttpStatusCode.NoContent }));

    TestBed.configureTestingModule({
      providers: [
        SecurityZoneService,
        { provide: CommunicationService, useValue: communicationServiceMock }
      ]
    });

    service = TestBed.inject(SecurityZoneService);
  });

  it('should create a security zone', () => {
    const origin = { x: 0, y: 0 };
    const dimensions = { width: 10, height: 10 };

    service.createSecurityZone(origin, dimensions);

    expect(communicationServiceMock.createSecurityZone).toHaveBeenCalledWith(origin, dimensions);
    expect(service['zoneOrigin']).toEqual(origin);
    expect(service['zoneDimensions']).toEqual(dimensions);
    expect(service['isSecurityZoneActivated']).toBeTrue();
  });

  it('should sync the security zone status', () => {
    service.syncSecurityZoneStatus();

    expect(communicationServiceMock.getSecurityZoneStatus).toHaveBeenCalled();
    expect(service['isSecurityZoneActivated']).toEqual(DEFAULT_ZONE_STATUS.status);
    expect(service['zoneOrigin']).toEqual(DEFAULT_ZONE_STATUS.origin);
    expect(service['zoneDimensions']).toEqual(DEFAULT_ZONE_STATUS.dimensions);
  });

  it('should delete the security zone', () => {
    service.deleteSecurityZone();

    expect(communicationServiceMock.deleteSecurityZone).toHaveBeenCalled();
    expect(service['zoneOrigin']).toBeUndefined();
    expect(service['zoneDimensions']).toBeUndefined();
    expect(service['isSecurityZoneActivated']).toBeFalse();
  });
});

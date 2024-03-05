import { CommunicationService, SecurityZoneStatusResponse } from './communication.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('CommunicationService', () => {
  let service: CommunicationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommunicationService]
    });
    service = TestBed.inject(CommunicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('POST /ready', () => {
    const readyEventSpy = spyOn(service['readyEvent'], 'next');
    service.pageReady([]);

    const req = httpMock.expectOne(`${service['baseUrl']}/ready`);
    expect(req.request.method).toBe('POST');

    req.flush(null, { status: 204, statusText: 'No Content' });
    expect(readyEventSpy).toHaveBeenCalled();
  });

  it('POST /start/sim', () => {
    const startMissionEventSpy = spyOn(service['startMissionEvent'], 'next');
    service.start(true);

    const req = httpMock.expectOne(`${service['baseUrl']}/start/sim`);
    expect(req.request.method).toBe('POST');

    req.flush(null, { status: 202, statusText: 'Accepted' });
    expect(startMissionEventSpy).toHaveBeenCalled();
  });

  it('POST /start', () => {
    const startMissionEventSpy = spyOn(service['startMissionEvent'], 'next');
    service.start(false);

    const req = httpMock.expectOne(`${service['baseUrl']}/start`);
    expect(req.request.method).toBe('POST');

    req.flush(null, { status: 202, statusText: 'Accepted' });
    expect(startMissionEventSpy).toHaveBeenCalled();
  });

  it('POST /stop false', () => {
    const stopMissionEventSpy = spyOn(service['stopMissionEvent'], 'next');
    service.stop(false);

    const req = httpMock.expectOne(`${service['baseUrl']}/stop?return=false`);
    expect(req.request.method).toBe('POST');

    req.flush(null, { status: 202, statusText: 'Accepted' });
    expect(stopMissionEventSpy).toHaveBeenCalled();
  });

  it('POST /stop true', () => {
    const stopMissionEventSpy = spyOn(service['stopMissionEvent'], 'next');
    service.stop(true);

    const req = httpMock.expectOne(`${service['baseUrl']}/stop?return=true`);
    expect(req.request.method).toBe('POST');

    req.flush(null, { status: 202, statusText: 'Accepted' });
    expect(stopMissionEventSpy).toHaveBeenCalled();
  });

  it('POST /identify/:id', () => {
    const robotNumber = '2';
    const response = {};

    service.identify(robotNumber).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/identify/${robotNumber}`);
    expect(req.request.method).toBe('POST');
  });

  it('GET /logs', () => {
    const response = [1, 2, 3];

    service.getLogs().subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/logs`);
    expect(req.request.method).toBe('GET');

    req.flush(response);
  });

  it('GET /logs/:id', () => {
    const missionId = 1;
    const response = 'mission log data';

    service.getMissionLogs(missionId).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/logs/${missionId}`);
    expect(req.request.method).toBe('GET');

    req.flush(response);
  });

  it('GET /maps/:id', () => {
    const mapId = 1;

    service.getMap(mapId).subscribe(() => {});

    const req = httpMock.expectOne(`${service['baseUrl']}/maps/${mapId}`);
    expect(req.request.method).toBe('GET');

  });

  it('GET /missions', () => {
    const response = [1, 2, 3];

    service.getMissions().subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/missions`);
    expect(req.request.method).toBe('GET');

    req.flush(response);
  });

  it('GET /missionStatus', () => {
    const response = true;

    service.getMissionStatus().subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/missionStatus`);
    expect(req.request.method).toBe('GET');

    req.flush(response);
  });

  it('GET /securityZone', () => {
    const response: SecurityZoneStatusResponse = {
      status: true,
      origin: { x: 0, y: 0 },
      dimensions: { width: 4, height: 3 }
    };

    service.getSecurityZoneStatus().subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/securityZone`);
    expect(req.request.method).toBe('GET');

    req.flush(response);
  });

  it('POST /securityZone', () => {
    const origin = { x: 0, y: 0 };
    const dimensions = { width: 4, height: 3 };

    service.createSecurityZone(origin, dimensions).subscribe(() => {});

    const req = httpMock.expectOne(`${service['baseUrl']}/securityZone`);
    expect(req.request.method).toBe('POST');

    const expectedBody = {
      origin: { x: origin.x, y: origin.y },
      dimensions: { width: dimensions.width, height: dimensions.height }
    };
    expect(req.request.body).toEqual(expectedBody);
  });

  it('DELETE /securityZone', () => {
    service.deleteSecurityZone().subscribe(() => {});

    const req = httpMock.expectOne(`${service['baseUrl']}/securityZone`);
    expect(req.request.method).toBe('DELETE');
  });

});



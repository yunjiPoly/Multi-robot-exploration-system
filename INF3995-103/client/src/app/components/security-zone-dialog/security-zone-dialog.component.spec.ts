import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SecurityZoneDialogComponent } from './security-zone-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityZoneService } from 'src/app/services/security-zone.service';

describe('SecurityZoneDialogComponent', () => {
  let component: SecurityZoneDialogComponent;
  let fixture: ComponentFixture<SecurityZoneDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<SecurityZoneDialogComponent>>;
  let securityZoneServiceSpy: jasmine.SpyObj<SecurityZoneService>;

  beforeEach(async () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);
      const securityZoneServiceSpyObj = jasmine.createSpyObj('SecurityZoneService', ['createSecurityZone']);
    await TestBed.configureTestingModule({
      declarations: [ SecurityZoneDialogComponent ],
      imports: [
        MatDialogModule, 
        MatFormFieldModule, 
        MatIconModule, 
        FormsModule, 
        ReactiveFormsModule, 
        BrowserAnimationsModule, 
        MatInputModule
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: SecurityZoneService, useValue: securityZoneServiceSpyObj }
      ]
    }).compileComponents();

    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<SecurityZoneDialogComponent>>;
    securityZoneServiceSpy = TestBed.inject(SecurityZoneService) as jasmine.SpyObj<SecurityZoneService>;

    fixture = TestBed.createComponent(SecurityZoneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create security zone on createSecurityZone', () => {
    component.formParameters.setValue({
      originX: 0,
      originY: 0,
      height: 2,
      width: 2
    });

    component.createSecurityZone();
    expect(securityZoneServiceSpy.createSecurityZone).toHaveBeenCalledOnceWith({ x: 0, y: 0 }, { width: 2, height: 2 });
  });

  it('should not allow a zone with an area smaller than 4', () => {
    component.formParameters.setValue({
      originX: 0,
      originY: 0,
      height: 1,
      width: 1
    });
    expect(component.formParameters.valid).toBeFalse();
  });

  it('should allow a zone with an area equal to 4', () => {
    component.formParameters.setValue({
      originX: 0,
      originY: 0,
      height: 2,
      width: 2
    });
    expect(component.formParameters.valid).toBeTrue();
  });

  it('should allow a zone with an area larger than 4', () => {
    component.formParameters.setValue({
      originX: 0,
      originY: 0,
      height: 4,
      width: 2
    });
    expect(component.formParameters.valid).toBeTrue();
  });

  it('should disable create button when form is invalid', () => {
    component.formParameters.setValue({
      originX: 0,
      originY: 0,
      height: 1,
      width: 1
    });
    fixture.detectChanges();
    expect(component.formParameters.valid).toBeFalse();
    expect(fixture.nativeElement.querySelector('#create-button').disabled).toBeTrue();
  });

  it('should enable create button when form is valid', () => {
    component.formParameters.setValue({
      originX: 0,
      originY: 0,
      height: 2,
      width: 2
    });
    fixture.detectChanges();

    expect(component.formParameters.valid).toBeTrue();
    expect(fixture.nativeElement.querySelector('#create-button').disabled).toBeFalse();
  });

  it('should close dialog on createSecurityZone success', () => {
    component.formParameters.setValue({
      originX: 0,
      originY: 0,
      height: 2,
      width: 2
    });

    component.createSecurityZone();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});

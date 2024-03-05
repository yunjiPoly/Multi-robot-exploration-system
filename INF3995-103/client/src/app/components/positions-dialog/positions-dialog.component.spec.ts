import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PositionsDialogComponent } from './positions-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MissionService } from 'src/app/services/mission.service';
import { By } from '@angular/platform-browser';

describe('PositionsDialogComponent', () => {
  let component: PositionsDialogComponent;
  let fixture: ComponentFixture<PositionsDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PositionsDialogComponent>>;

  beforeEach(async () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);
    const missionServiceSpyObj = jasmine.createSpyObj('MissionService', ['setInitialPositions']);
    
    await TestBed.configureTestingModule({
      declarations: [PositionsDialogComponent],
      imports: [ ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, BrowserAnimationsModule ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MissionService, useValue: missionServiceSpyObj }
      ]
    }).compileComponents();

    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<PositionsDialogComponent>>;

    fixture = TestBed.createComponent(PositionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with false when closeDialog() is called', () => {
    component.closeDialog();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should close the dialog with true when setInitialPositions() is called', () => {
    component.setInitialPositions();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should disable the submit button when the form is invalid', () => {
    component.formParameters.get('originX2')?.setValue(-10);
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBeTrue();
  });

  it('should enable the submit button when the form is valid', () => {
    component.formParameters.get('originX2')?.setValue(2);
    component.formParameters.get('originY2')?.setValue(2);
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBeFalse();
  });

  it('should have error if position is not 0.5m from origin ', () => {
    component['formParameters'].setValue({ originX2: 0, originY2: 0.2, orientation2: 90 });
    
    expect(component.formParameters.getError('distanceTooSmall')).toBeTrue();
  });

  it('should NOT have error if position is more than 0.5m from origin ', () => {
    component['formParameters'].setValue({ originX2: 2, originY2: 2, orientation2: 90 });
    
    expect(component.formParameters.getError('distanceTooSmall')).toBeNull();
  });

  it('should set mission service initial positions', () => {
    const testPosition = { x: 2, y: 2, orientation: 90 };
    component['formParameters'].setValue({ originX2: testPosition.x, originY2: testPosition.y, orientation2: testPosition.orientation });
    component['missionService'].initialPositions = [];

    component.setInitialPositions();
    expect(component['missionService'].initialPositions).toEqual([testPosition]);
  });
});
